import { useState } from 'react';
import { Button, Group, Rating, Stack, Text, Textarea } from '@mantine/core';
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
        product_id: productId,
        user_id: user.id,
        rating,
        comment,
        is_approved: false,
        created_at: new Date().toISOString(),
        is_verified_purchase: false // Satın alma kontrolü eklenebilir
      });

      notifications.show({
        title: 'Başarılı',
        message: 'Yorumunuz başarıyla gönderildi ve moderasyon onayı bekliyor.',
        color: 'green',
      });

      setRating(0);
      setComment('');
      onReviewAdded?.();
    } catch (error) {
      console.error('Yorum gönderilirken hata:', error);
      notifications.show({
        title: 'Hata',
        message: 'Yorumunuz gönderilirken bir hata oluştu.',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing="md">
        <div>
          <Text size="sm" weight={500} mb={4}>
            Puanınız
          </Text>
          <Rating value={rating} onChange={setRating} size="lg" />
        </div>

        <div>
          <Text size="sm" weight={500} mb={4}>
            Yorumunuz
          </Text>
          <Textarea
            placeholder="Yorumunuzu yazın..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            minRows={3}
          />
        </div>

        <Group position="apart">
          <Text size="xs" color="dimmed">
            Yorumunuz moderasyon onayından sonra yayınlanacaktır.
          </Text>
          <Button 
            type="submit" 
            loading={loading}
            disabled={!rating}
          >
            Yorum Ekle
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

ReviewForm.propTypes = {
  productId: PropTypes.string.isRequired,
  onReviewAdded: PropTypes.func,
}; 