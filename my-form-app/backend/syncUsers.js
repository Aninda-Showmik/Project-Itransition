import axios from 'axios';
// syncUsers.js
import { User, Role, Form, QuizResponse } from './index.js';

import bcrypt from 'bcrypt';

const fetchUsersFromClerk = async () => {
  try {
    const response = await axios.get('https://api.clerk.dev/v1/users', {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users from Clerk:', error);
    return [];
  }
};

const syncClerkUsers = async () => {
  try {
    const clerkUsers = await fetchUsersFromClerk();

    if (clerkUsers.length === 0) {
      console.log('No users found from Clerk');
      return;
    }

    for (const userData of clerkUsers) {
      const { id, email_addresses } = userData;
      const email = email_addresses[0]?.email_address;

      if (!email) {
        console.log(`❌ No email for Clerk user ${id}. Skipping...`);
        continue;
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        console.log(`User with email ${email} already exists. Skipping...`);
        continue;
      }

      const [userRole] = await Role.findOrCreate({ where: { name: 'user' } });

      await User.create({
        email,
        clerkUserId: id,
        password: await bcrypt.hash('default_password', 10),
        roleId: userRole.id,
      });

      console.log(`✅ User ${email} synced from Clerk`);
    }
  } catch (error) {
    console.error('Error syncing Clerk users:', error);
  }
};


export { syncClerkUsers };
