import { useEffect, useState } from "react";
import {
  Table,
  Group,
  Text,
  Paper,
  Title,
  Badge,
  ActionIcon,
  Stack,
  Loader,
  Center,
  Rating,
  Menu,
  Button,
} from "@mantine/core";
import { IconCheck, IconX, IconDotsVertical, IconTrash } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { getAllReviews, updateReview, deleteReview } from "../../../services/supabase/reviews";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function ReviewModeration() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Yorumlar yüklenirken hata:", error);
      notifications.show({
        title: "Hata",
        message: "Yorumlar yüklenirken bir hata oluştu.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleApprove = async (reviewId) => {
    try {
      setLoading(true);
      console.log('Yorum onaylama başladı:', reviewId);
      
      const updatedReview = await updateReview(reviewId, { 
        is_approved: true,
        updated_at: new Date().toISOString()
      });
      
      console.log('Güncellenmiş yorum:', updatedReview);

      notifications.show({
        title: "Başarılı",
        message: "Yorum onaylandı.",
        color: "green",
      });
      
      // Güncel listeyi getir
      await loadReviews();
    } catch (error) {
      console.error("Yorum onaylanırken hata:", error);
      notifications.show({
        title: "Hata",
        message: error.message || "Yorum onaylanırken bir hata oluştu.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      setLoading(true);
      await updateReview(reviewId, { 
        is_approved: false,
        updated_at: new Date().toISOString()
      });

      notifications.show({
        title: "Başarılı",
        message: "Yorum reddedildi.",
        color: "orange",
      });
      
      // Güncel listeyi getir
      loadReviews();
    } catch (error) {
      console.error("Yorum reddedilirken hata:", error);
      notifications.show({
        title: "Hata",
        message: error.message || "Yorum reddedilirken bir hata oluştu.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Bu yorumu silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      await deleteReview(reviewId);
      notifications.show({
        title: "Başarılı",
        message: "Yorum silindi.",
        color: "green",
      });
      loadReviews();
    } catch (error) {
      console.error("Yorum silinirken hata:", error);
      notifications.show({
        title: "Hata",
        message: "Yorum silinirken bir hata oluştu.",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Center h={400}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Stack>
      <Group position="apart">
        <Title order={2}>Yorum Moderasyonu</Title>
        <Button 
          variant="light" 
          onClick={loadReviews}
          loading={loading}
        >
          Yenile
        </Button>
      </Group>

      <Paper p="md" withBorder>
        <Table>
          <thead>
            <tr>
              <th>Kullanıcı</th>
              <th>Ürün</th>
              <th>Puan</th>
              <th>Yorum</th>
              <th>Tarih</th>
              <th>Durum</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.auth_users_view?.email}</td>
                <td>{review.products?.name}</td>
                <td>
                  <Rating value={review.rating} readOnly />
                </td>
                <td style={{ maxWidth: "300px" }}>
                  <Text lineClamp={2}>{review.comment}</Text>
                </td>
                <td>
                  {formatDistanceToNow(new Date(review.created_at), {
                    addSuffix: true,
                    locale: tr,
                  })}
                </td>
                <td>
                  <Badge
                    color={review.is_approved ? "green" : "orange"}
                  >
                    {review.is_approved ? "Onaylı" : "Beklemede"}
                  </Badge>
                </td>
                <td>
                  <Group spacing={8}>
                    <ActionIcon
                      color="green"
                      onClick={() => handleApprove(review.id)}
                      disabled={review.is_approved}
                      title="Onayla"
                    >
                      <IconCheck size={16} />
                    </ActionIcon>
                    <ActionIcon
                      color="orange"
                      onClick={() => handleReject(review.id)}
                      disabled={!review.is_approved}
                      title="Reddet"
                    >
                      <IconX size={16} />
                    </ActionIcon>
                    <Menu>
                      <Menu.Target>
                        <ActionIcon>
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          onClick={() => handleDelete(review.id)}
                        >
                          Sil
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Paper>
    </Stack>
  );
} 