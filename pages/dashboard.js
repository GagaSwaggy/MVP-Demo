import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch campaigns
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          setCampaigns(data.data);
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Business Dashboard</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <Link href="/campaigns/new" className="bg-blue-500 text-white px-4 py-2 rounded">Create New Campaign
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.length > 0 ? (
          campaigns.map((campaign) => (
            <div key={campaign._id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{campaign.name}</h2>
              <p className="text-gray-600 mb-2">{campaign.description}</p>
              <div className="mb-2">
                <span className="font-medium">Task:</span> {campaign.task.description}
              </div>
              <div className="mb-2">
                <span className="font-medium">Rewards:</span>
                <div>Referrer: {campaign.rewards.referrerDiscount}{campaign.rewards.discountType === 'percentage' ? '%' : ' units'}</div>
                <div>Referred: {campaign.rewards.referredDiscount}{campaign.rewards.discountType === 'percentage' ? '%' : ' units'}</div>
              </div>
              <div className="mb-2">
                <span className="font-medium">Status:</span> {campaign.active ? 'Active' : 'Inactive'}
              </div>
              <div className="flex space-x-2 mt-4">
                <Link href={`/campaigns/${campaign._id}`} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">View
                </Link>
                <Link href={`/campaigns/${campaign._id}/edit`} className="bg-green-500 text-white px-3 py-1 rounded text-sm">Edit
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p>No campaigns found. Create your first campaign!</p>
          </div>
        )}
      </div>
    </div>
  );
}