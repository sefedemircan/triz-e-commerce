import { Skeleton, Grid, Container } from '@mantine/core';

const ContentSkeleton = ({ count = 4 }) => {
  return (
    <Container size="lg" py="xl">
      <Grid>
        {Array(count)
          .fill(0)
          .map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
              <Skeleton height={200} radius="md" mb="sm" />
              <Skeleton height={20} radius="md" mb="sm" width="70%" />
              <Skeleton height={20} radius="md" mb="sm" width="40%" />
              <Skeleton height={36} radius="xl" width="60%" />
            </Grid.Col>
          ))}
      </Grid>
    </Container>
  );
};

export default ContentSkeleton; 