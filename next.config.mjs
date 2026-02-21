/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // чтобы next/image нормально работал с локальными загрузками
    unoptimized: true,
  },
};

export default nextConfig;