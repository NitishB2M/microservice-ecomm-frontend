import React from 'react';
import { Container, Grid, Box, Skeleton } from '@mui/material';

const ProductDetailsSkeleton = () => {
  return (
    <Container maxWidth="xl" className="py-8">
      <Grid container spacing={6}>
        {/* Product Image Skeleton */}
        <Grid item xs={12} md={6}>
          <Box className="bg-light-card-background dark:bg-dark-card-background rounded-lg p-4">
            <Skeleton
              variant="rectangular"
              width="100%"
              height={400}
              className="rounded-lg"
            />
          </Box>
        </Grid>

        {/* Product Info Skeleton */}
        <Grid item xs={12} md={6}>
          <Box className="space-y-6">
            {/* Title */}
            <Skeleton variant="text" width="80%" height={40} />

            {/* Rating */}
            <Box className="flex items-center space-x-4">
              <Skeleton variant="text" width={120} height={24} />
              <Skeleton variant="text" width={100} height={24} />
            </Box>

            {/* Price */}
            <Skeleton variant="text" width={150} height={40} />

            {/* Description */}
            <Box className="space-y-2">
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="100%" />
              <Skeleton variant="text" width="80%" />
            </Box>

            {/* Quantity Selector */}
            <Box className="flex items-center space-x-4">
              <Skeleton variant="text" width={80} height={40} />
              <Box className="flex items-center space-x-2">
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="text" width={40} height={40} />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box className="flex space-x-4">
              <Skeleton variant="rectangular" width="70%" height={48} className="rounded-md" />
              <Skeleton variant="circular" width={48} height={48} />
              <Skeleton variant="circular" width={48} height={48} />
            </Box>

            {/* Delivery Info */}
            <Box className="mt-6 p-4 bg-light-card-background dark:bg-dark-card-background rounded-lg">
              <Box className="flex items-center space-x-2 mb-2">
                <Skeleton variant="circular" width={24} height={24} />
                <Skeleton variant="text" width={120} height={24} />
              </Box>
              <Skeleton variant="text" width="90%" height={20} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailsSkeleton;
