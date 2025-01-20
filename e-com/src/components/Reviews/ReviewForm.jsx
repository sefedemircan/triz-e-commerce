import { useState } from 'react';
import { Button, Group, Rating, Textarea } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { addReview } from '../../services/supabase/reviews';
import { useAuthStore } from '../../stores/authStore';
import PropTypes from 'prop-types';

export function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      notifications.show({
        title: 'Hata',
        message: 'Lütfen bir puan verin',
        color: 'red',
      });
      return;
    }

    try {
      setLoading(true);
      await addReview({
        productId,
        userId: user.id,
        rating,
        comment,
      });

      notifications.show({
        title: 'Başarılı',
        message: 'Yorumunuz başarıyla eklendi',
        color: 'green',
      });

      setRating(0);
      setComment('');
      onReviewAdded?.();
    } catch {
      notifications.show({
        title: 'Hata',
        message: 'Yorum eklenirken bir hata oluştu',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit}>
      <Group mb="md">
        <Rating value={rating} onChange={setRating} size="lg" />
      </Group>
      
      <Textarea
        placeholder="Yorumunuzu yazın..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        minRows={3}
        mb="md"
      />

      <Button 
        type="submit" 
        loading={loading}
        disabled={!rating}
      >
        Yorum Ekle
      </Button>
    </form>
  );
}

ReviewForm.propTypes = {
  productId: PropTypes.string.isRequired,
  onReviewAdded: PropTypes.func,
}; 