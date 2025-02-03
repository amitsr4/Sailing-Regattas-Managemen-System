// @deno-types="npm:@types/react"
import React, { useState } from 'react';
import { useDB } from '@goatdb/goatdb/react';
import { kSchemeSailorProfile } from '../../../schema.ts';

export function LoginPrompt() {
  const db = useDB();

  const handleDevLogin = async () => {
    try {
      const devUserId = crypto.randomUUID();

      await db.load(`/sys/users/${devUserId}`, kSchemeSailorProfile, {
        userId: devUserId,
        name: 'Test User',
        type: 'seriesOrganizer',
        role: 'admin',
        mobile: '0527501111',
        location: 'Tel Aviv',
        participatingEvents: new Set<string>(),
        ownedBoats: new Set<string>(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      localStorage.setItem('devUserId', devUserId);
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Sailing Regattas Management</h2>
      <button
        onClick={handleDevLogin}
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
        Login as Test User
      </button>
    </div>
  );
}

// export function LoginPrompt() {
//   const [email, setEmail] = useState('');
//   const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
//   const db = useDB();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setStatus('sending');

//     try {
//       const success = await db.loginWithMagicLinkEmail(email);
//       if (success) {
//         setStatus('sent');
//       } else {
//         setStatus('idle');
//         alert('Failed to send login email. Please try again.');
//       }
//     } catch (error) {
//       setStatus('idle');
//       console.error('Login error:', error);
//       alert('An error occurred. Please try again.');
//     }
//   };

//   if (status === 'sent') {
//     return (
//       <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
//         <h2 className="text-xl font-bold mb-4">Check Your Email</h2>
//         <p>We've sent a magic link to {email}. Click the link to sign in.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-xl font-bold mb-4">Sign In</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter your email"
//           className="w-full p-2 border rounded mb-4"
//           required
//         />
//         <button
//           type="submit"
//           disabled={status === 'sending'}
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">
//           {status === 'sending' ? 'Sending...' : 'Send Magic Link'}
//         </button>
//       </form>
//     </div>
//   );
// }
