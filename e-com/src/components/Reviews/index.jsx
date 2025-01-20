import { Stack } from '@mantine/core';
import { ReviewForm } from './ReviewForm';
import { ReviewList } from './ReviewList';
import PropTypes from 'prop-types';

export function Reviews({ productId }) {
  return (
    <Stack spacing="xl">
      <ReviewForm 
        productId={productId} 
        onReviewAdded={() => window.location.reload()}
      />
      <ReviewList productId={productId} />
    </Stack>
  );
}

Reviews.propTypes = {
  productId: PropTypes.string.isRequired,
}; 