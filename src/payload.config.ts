import { buildConfig } from 'payload/config';
import { cachePlugin } from '@aengz/payload-redis-cache'
import path from 'path';
import Products from './collections/Products';
import Users from './collections/Users';

export default buildConfig({
  serverURL: process.env.PAYLOAD_HOST,
  plugins: [
    cachePlugin({ 
      excludedCollections: ['users'],
    })
  ],
  admin: {
    user: Users.slug,
  },
  collections: [
    Products,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
});
