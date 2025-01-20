import { useEffect, useState } from 'react';
import { Avatar, Card, Group, Rating, Stack, Text, Title, Alert } from '@mantine/core';
import { IconAlertCircle, IconUser } from '@tabler/icons-react';
import { getProductReviews } from '../../services/supabase/reviews';
import { formatDistance } from 'date-fns';
import { tr } from 'date-fns/locale';
import PropTypes from 'prop-types';

export function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (err) {
      console.error('Yorumlar yüklenirken hata:', err);
      setError('Yorumlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [productId]);

  if (loading) {
    return <Text>Yorumlar yükleniyor...</Text>;
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} title="Hata" color="red">
        {error}
      </Alert>
    );
  }

  if (!reviews || reviews.length === 0) {
    return <Text>Henüz yorum yapılmamış.</Text>;
  }

  return (
    <Stack>
      <Title order={3} mb="md">
        Müşteri Yorumları ({reviews.length})
      </Title>

      {reviews.map((review) => (
        <Card key={review.id} withBorder>
          <Group>
            <Avatar 
              color="orange"
              radius="xl"
            >
              <IconUser size={24} />
            </Avatar>
            <div style={{ flex: 1 }}>
              <Group justify="space-between">
                <Text fw={500}>
                  {review.user?.email?.split('@')[0] || 'Anonim'}
                </Text>
                <Text size="sm" c="dimmed">
                  {formatDistance(new Date(review.created_at), new Date(), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </Text>
              </Group>
              <Rating value={review.rating} readOnly />
              {review.is_verified_purchase && (
                <Text size="sm" color="green" mt={4}>
                  Doğrulanmış Satın Alma
                </Text>
              )}
            </div>
          </Group>

          {review.comment && (
            <Text mt="sm">{review.comment}</Text>
          )}
        </Card>
      ))}
    </Stack>
  );
}

ReviewList.propTypes = {
  productId: PropTypes.string.isRequired,
}; 