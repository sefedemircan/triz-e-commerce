import { useEffect, useState } from 'react';
import { Stack, Text, Group, Avatar, Paper } from '@mantine/core';
import { getReviews } from '../../services/supabase/reviews';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import PropTypes from 'prop-types';

export function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await getReviews(productId);
        // Sadece onaylanmış yorumları göster
        const approvedReviews = data.filter(review => review.is_approved);
        setReviews(approvedReviews);
      } catch (error) {
        console.error("Yorumlar yüklenirken hata:", error);
        setError("Yorumlar yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [productId]);

  if (loading) {
    return <Text>Yorumlar yükleniyor...</Text>;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (reviews.length === 0) {
    return <Text>Bu ürün için henüz onaylanmış yorum bulunmuyor.</Text>;
  }

  return (
    <Stack spacing="md">
      {reviews.map((review) => (
        <Paper key={review.id} p="md" withBorder>
          <Group position="apart" mb="xs">
            <Group>
              <Avatar 
                radius="xl" 
                color="blue"
              >
                {review.auth_users_view?.email?.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Text size="sm">{review.auth_users_view?.email}</Text>
                <Text size="xs" color="dimmed">
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </Text>
              </div>
            </Group>
            <Group spacing={4}>
              {[...Array(5)].map((_, i) => (
                <Text
                  key={i}
                  color={i < review.rating ? "yellow" : "gray"}
                  style={{ opacity: i < review.rating ? 1 : 0.5 }}
                >
                  ★
                </Text>
              ))}
            </Group>
          </Group>
          <Text size="sm">{review.comment}</Text>
        </Paper>
      ))}
    </Stack>
  );
}

ReviewList.propTypes = {
  productId: PropTypes.string.isRequired,
}; 