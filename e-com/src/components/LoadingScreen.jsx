import { Center, Loader, Stack, Text, Paper } from '@mantine/core';
import { motion } from 'framer-motion';

const LoadingScreen = ({ message = 'Yükleniyor' }) => {
  return (
    <Center h="100vh" w="100%">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Paper shadow="md" p="xl" radius="md">
          <Stack align="center" spacing="md">
            <Loader size="lg" variant="dots" color="orange" />
            <Text size="lg" fw={500} c="dimmed">
              {message}
            </Text>
          </Stack>
        </Paper>
      </motion.div>
    </Center>
  );
};

export default LoadingScreen; 