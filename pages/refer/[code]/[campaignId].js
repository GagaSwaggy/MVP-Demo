import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
export default function ReferralPage() {
  const router = useRouter();
  const { code, campaignId } = router.query;
  
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [success, setSuccess] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch campaign details
    const fetchCampaign = async () => {
      if (!campaignId) return;

      try {
        const response = await fetch(`/api/campaigns/${campaignId}/public`);
        const data = await response.json();
        
        if (data.success) {
          setCampaign(data.data);
        } else {
          setError('Campaign not found or inactive');
        }
      } catch (error) {
        setError('Failed to load campaign');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaign();
    }
  }, [campaignId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/referrals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralCode: code,
          campaignId,
          email: formData.email,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setDiscountCode(data.data.discountCode);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to complete referral');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !campaign) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error && !campaign) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{campaign?.name || 'Referral Offer'}</title>
      </Head>

      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          {success ? (
            <div className="text-center">
              <h1 className="text-2xl font-bold text-green-600 mb-4">Success!</h1>
              <p className="mb-4">Thank you for completing the referral.</p>
              
              <div className="bg-gray-100 p-4 rounded mb-4">
                <p className="font-medium">Your discount code:</p>
                <div className="text-xl font-bold my-2">{discountCode}</div>
                <p className="text-sm text-gray-600">
                  {campaign.rewards.discountType === 'percentage' 
                    ? `${campaign.rewards.referredDiscount}% off your purchase` 
                    : `$${campaign.rewards.referredDiscount} off your purchase`}
                </p>
              </div>
              <p className="mt-6">
                Want to earn more rewards? <Link href="/get-referral" className="text-blue-500">Get your own referral link</Link>
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">{campaign.name}</h1>
              <p className="mb-6">{campaign.description}</p>

              <div className="mb-6 bg-blue-50 p-4 rounded">
                <h2 className="font-medium mb-2">Complete this task to earn your reward:</h2>
                <p>{campaign.task.description}</p>
              </div>

              <div className="mb-6">
                <h2 className="font-medium mb-2">Your reward:</h2>
                <p>
                  {campaign.rewards.discountType === 'percentage' 
                    ? `${campaign.rewards.referredDiscount}% off your purchase` 
                    : `$${campaign.rewards.referredDiscount} off your purchase`}
                </p>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Your Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Your Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Complete Task & Get Reward'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}