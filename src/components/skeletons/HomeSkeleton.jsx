import React from 'react';
import { Container, Grid, Box } from '@mui/material';
import ProductCardSkeleton from './ProductCardSkeleton';

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section Skeleton */}
      <section className="bg-black">
        <Container maxWidth="xl" className="py-16">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <div className="space-y-4">
                <div className="h-12 bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-8 bg-gray-700 rounded w-1/2 animate-pulse" />
                <div className="h-12 bg-gray-700 rounded w-40 animate-pulse mt-6" />
              </div>
            </Grid>
            <Grid item xs={12} md={6}>
              <div className="w-full h-[300px] bg-gray-700 rounded animate-pulse" />
            </Grid>
          </Grid>
        </Container>
      </section>

      {/* Categories Section Skeleton */}
      <Container maxWidth="xl" className="py-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid item xs={6} sm={4} md={2} key={i}>
              <div className="p-4 border border-gray-200 rounded-sm">
                <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-20 mx-auto animate-pulse" />
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Flash Sale Section Skeleton */}
      <Container maxWidth="xl" className="py-16">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center">
                  <div className="h-8 bg-gray-200 rounded w-12 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-16 mt-1 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section Skeleton */}
      <Container maxWidth="xl" className="py-16">
        <div className="h-8 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <ProductCardSkeleton />
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default HomeSkeleton;
