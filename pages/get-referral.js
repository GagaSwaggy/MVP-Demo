
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function GetReferral() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch active campaigns
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns/active');
        const data = await response.json();
        
        if (data.success) {
          setCampaigns(data.data);
          if (data.data.length > 0) {
            setSelectedCampaign(data.data[0]._id);
          }
        }
      } catch (error) {
        setError('Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setError('');
    setReferralLink('');

    try {
      const response = await fetch('/api/referrals/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          campaignId: selectedCampaign,
          email: formData.email,
          name: formData.name,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setReferralLink(data.data.referralUrl);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to generate referral link');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading campaigns...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Get Your Referral Link</title>
      </Head>

      <div className="container mx-auto p-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          <h1 className="text-2xl font-bold mb-4">Get Your Referral Link</h1>
          
          {campaigns.length === 0 ? (
            <p>No active campaigns available.</p>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {referralLink ? (
                <div className="bg-green-50 p-4 rounded mb-4">
                  <h2 className="font-medium mb-2">Your Referral Link:</h2>
                  <div className="break-all bg-white p-2 border rounded mb-2">
                    {referralLink}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(referralLink);
                      alert("Referral link copied to clipboard!");
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Copy Link
                  </button>
                  
                  <p className="mt-4 text-sm">
                    Share this link with your friends. When they complete the required task,you'll both receive a discount!
                  </p>
                  
                  <button
                    onClick={() => setReferralLink('')}
                    className="mt-4 text-blue-500"
                  >
                    Generate a different link
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block mb-2">Select Campaign</label>
                    <select
                      value={selectedCampaign}
                      onChange={(e) => setSelectedCampaign(e.target.value)}
                      className="w-full p-2 border rounded"
                      required
                    >
                      {campaigns.map((campaign) => (
                        <option key={campaign._id} value={campaign._id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                    disabled={generating}
                  >
                    {generating ? 'Generating...' : 'Generate Referral Link'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}