import { z } from 'zod';
import { createTRPCRouter, publicProcedure, protectedProcedure } from '../trpc';
import { calculateUnderwriting } from '@/engine/underwriting';
import { scoreDeal } from '@/engine/deal-scoring';
import { estimateRent } from '@/engine/rent-estimation';
import { TRPCError } from '@trpc/server';

// Input schemas
const createDealSchema = z.object({
  propertyName: z.string().min(1),
  propertyAddress: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1).max(2),
  zipCode: z.string().min(5).max(10),
  propertyType: z.string(),
  yearBuilt: z.number().optional(),
  squareFootage: z.number().optional(),
  lotSize: z.number().optional(),
  units: z.number().default(1),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  
  purchasePrice: z.number().positive(),
  afterRepairValue: z.number().optional(),
  rehabCosts: z.number().optional(),
  closingCosts: z.number().optional(),
  
  loanAmount: z.number().optional(),
  interestRate: z.number().optional(),
  loanTermYears: z.number().optional(),
  downPayment: z.number().optional(),
  
  monthlyRent: z.number().optional(),
  otherIncome: z.number().optional(),
  vacancyRate: z.number().optional(),
  
  propertyTaxes: z.number().optional(),
  insurance: z.number().optional(),
  utilities: z.number().optional(),
  maintenance: z.number().optional(),
  propertyManagement: z.number().optional(),
  hoaFees: z.number().optional(),
  otherExpenses: z.number().optional(),
  
  notes: z.string().optional(),
});

const updateDealSchema = createDealSchema.partial().extend({
  id: z.string(),
});

const dealFiltersSchema = z.object({
  status: z.array(z.string()).optional(),
  propertyType: z.array(z.string()).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minDSCR: z.number().optional(),
  state: z.string().optional(),
  search: z.string().optional(),
});

export const dealsRouter = createTRPCRouter({
  // Get all deals for the current user
  list: protectedProcedure
    .input(dealFiltersSchema.optional())
    .query(async ({ ctx, input }) => {
      const filters = input || {};
      
      const where: Record<string, unknown> = {
        userId: ctx.session.user.id,
      };
      
      if (filters.status?.length) {
        where.status = { in: filters.status };
      }
      if (filters.propertyType?.length) {
        where.propertyType = { in: filters.propertyType };
      }
      if (filters.minPrice || filters.maxPrice) {
        where.purchasePrice = {
          ...(filters.minPrice && { gte: filters.minPrice }),
          ...(filters.maxPrice && { lte: filters.maxPrice }),
        };
      }
      if (filters.minDSCR) {
        where.dscr = { gte: filters.minDSCR };
      }
      if (filters.state) {
        where.state = filters.state;
      }
      if (filters.search) {
        where.OR = [
          { propertyName: { contains: filters.search, mode: 'insensitive' } },
          { propertyAddress: { contains: filters.search, mode: 'insensitive' } },
          { city: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
      
      return ctx.prisma.deal.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
    }),

  // Get a single deal by ID
  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const deal = await ctx.prisma.deal.findFirst({
        where: {
          id: input,
          userId: ctx.session.user.id,
        },
        include: {
          comparables: true,
          documents: true,
          lenderSubmissions: {
            include: { lender: true },
          },
        },
      });

      if (!deal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      return deal;
    }),

  // Create a new deal
  create: protectedProcedure
    .input(createDealSchema)
    .mutation(async ({ ctx, input }) => {
      // Calculate underwriting metrics
      const underwritingResult = calculateUnderwriting({
        purchasePrice: input.purchasePrice,
        monthlyRent: input.monthlyRent || 0,
        otherIncome: input.otherIncome,
        vacancyRate: input.vacancyRate,
        propertyTaxes: input.propertyTaxes,
        insurance: input.insurance,
        utilities: input.utilities,
        maintenance: input.maintenance,
        propertyManagement: input.propertyManagement,
        hoaFees: input.hoaFees,
        otherExpenses: input.otherExpenses,
        loanAmount: input.loanAmount,
        interestRate: input.interestRate,
        loanTermYears: input.loanTermYears,
      });

      // Calculate deal score
      const scoreResult = scoreDeal({
        dscr: underwritingResult.dscr,
        capRate: underwritingResult.capRate,
        cashOnCash: underwritingResult.cashOnCash,
        purchasePrice: input.purchasePrice,
        afterRepairValue: input.afterRepairValue,
        rehabCosts: input.rehabCosts,
        propertyType: input.propertyType,
        yearBuilt: input.yearBuilt,
      });

      return ctx.prisma.deal.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          grossAnnualIncome: underwritingResult.grossAnnualIncome,
          effectiveGrossIncome: underwritingResult.effectiveGrossIncome,
          operatingExpenses: underwritingResult.totalOperatingExpenses,
          noi: underwritingResult.noi,
          annualDebtService: underwritingResult.annualDebtService,
          dscr: underwritingResult.dscr,
          capRate: underwritingResult.capRate,
          cashOnCash: underwritingResult.cashOnCash,
          dealScore: scoreResult.totalScore,
        },
      });
    }),

  // Update a deal
  update: protectedProcedure
    .input(updateDealSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      // Verify ownership
      const existing = await ctx.prisma.deal.findFirst({
        where: { id, userId: ctx.session.user.id },
      });

      if (!existing) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      // Recalculate metrics with updated data
      const mergedData = { ...existing, ...data };
      
      const underwritingResult = calculateUnderwriting({
        purchasePrice: mergedData.purchasePrice,
        monthlyRent: mergedData.monthlyRent || 0,
        otherIncome: mergedData.otherIncome || 0,
        vacancyRate: mergedData.vacancyRate || undefined,
        propertyTaxes: mergedData.propertyTaxes || undefined,
        insurance: mergedData.insurance || undefined,
        utilities: mergedData.utilities || undefined,
        maintenance: mergedData.maintenance || undefined,
        propertyManagement: mergedData.propertyManagement || undefined,
        hoaFees: mergedData.hoaFees || undefined,
        otherExpenses: mergedData.otherExpenses || undefined,
        loanAmount: mergedData.loanAmount || undefined,
        interestRate: mergedData.interestRate || undefined,
        loanTermYears: mergedData.loanTermYears || undefined,
      });

      const scoreResult = scoreDeal({
        dscr: underwritingResult.dscr,
        capRate: underwritingResult.capRate,
        cashOnCash: underwritingResult.cashOnCash,
        purchasePrice: mergedData.purchasePrice,
        afterRepairValue: mergedData.afterRepairValue || undefined,
        rehabCosts: mergedData.rehabCosts || undefined,
        propertyType: mergedData.propertyType,
        yearBuilt: mergedData.yearBuilt || undefined,
      });

      return ctx.prisma.deal.update({
        where: { id },
        data: {
          ...data,
          grossAnnualIncome: underwritingResult.grossAnnualIncome,
          effectiveGrossIncome: underwritingResult.effectiveGrossIncome,
          operatingExpenses: underwritingResult.totalOperatingExpenses,
          noi: underwritingResult.noi,
          annualDebtService: underwritingResult.annualDebtService,
          dscr: underwritingResult.dscr,
          capRate: underwritingResult.capRate,
          cashOnCash: underwritingResult.cashOnCash,
          dealScore: scoreResult.totalScore,
        },
      });
    }),

  // Delete a deal
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deal = await ctx.prisma.deal.findFirst({
        where: { id: input, userId: ctx.session.user.id },
      });

      if (!deal) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Deal not found',
        });
      }

      return ctx.prisma.deal.delete({ where: { id: input } });
    }),

  // Estimate rent for a property
  estimateRent: publicProcedure
    .input(z.object({
      zipCode: z.string(),
      propertyType: z.string(),
      bedrooms: z.number(),
      bathrooms: z.number(),
      squareFootage: z.number().optional(),
      yearBuilt: z.number().optional(),
      amenities: z.array(z.string()).optional(),
    }))
    .query(({ input }) => {
      return estimateRent(input);
    }),

  // Get dashboard metrics
  dashboardMetrics: protectedProcedure.query(async ({ ctx }) => {
    const deals = await ctx.prisma.deal.findMany({
      where: { userId: ctx.session.user.id },
    });

    const activeDeals = deals.filter(d => 
      !['CLOSED', 'ARCHIVED', 'REJECTED'].includes(d.status)
    );

    const totalPortfolioValue = deals.reduce(
      (sum, d) => sum + d.purchasePrice, 0
    );

    const avgDSCR = activeDeals.length > 0
      ? activeDeals.reduce((sum, d) => sum + (d.dscr || 0), 0) / activeDeals.length
      : 0;

    const avgCapRate = activeDeals.length > 0
      ? activeDeals.reduce((sum, d) => sum + (d.capRate || 0), 0) / activeDeals.length
      : 0;

    const dealsByStatus = deals.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDeals: deals.length,
      activeDeals: activeDeals.length,
      totalPortfolioValue,
      averageDSCR: avgDSCR,
      averageCapRate: avgCapRate,
      dealsByStatus,
      recentActivity: [],
    };
  }),
});
