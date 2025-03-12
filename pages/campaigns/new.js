import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function NewCampaign() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    task: {
      description: '',
      validationMethod: 'manual',
    },
    rewards: {
      referrerDiscount: 10,
      referredDiscount: 10,
      discountType: 'percentage',
    },
    active: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (error) {
      setError('Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Campaign</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Campaign Name</label>
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
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Task Description</label>
            <textarea
              name="task.description"
              value={formData.task.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="2"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Task Description</label>
            <textarea
              name="task.description"
              value={formData.task.description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="2"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Validation Method</label>
            <select
              name="task.validationMethod"
              value={formData.task.validationMethod}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="manual">Manual (Business validates completion)</option>
              <option value="auto">Automatic (System validates completion)</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Referrer Discount</label>
            <div className="flex">
              <input
                type="number"
                name="rewards.referrerDiscount"
                value={formData.rewards.referrerDiscount}
                onChange={handleChange}
                className="w-24 p-2 border rounded-l"
                min="0"
                required
              />
              <select
                name="rewards.discountType"
                value={formData.rewards.discountType}
                onChange={handleChange}
                className="p-2 border-t border-b border-r rounded-r"
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2">Referred User Discount</label>
            <div className="flex">
              <input
                type="number"
                name="rewards.referredDiscount"
                value={formData.rewards.referredDiscount}
                onChange={handleChange}
                className="w-24 p-2 border rounded-l"
                min="0"
                required
              />
              <select
                name="rewards.discountType"
                value={formData.rewards.discountType}
                onChange={handleChange}
                className="p-2 border-t border-b border-r rounded-r"
                disabled
              >
                <option value="percentage">%</option>
                <option value="fixed">$</option>
              </select>
              <span className="ml-2 text-gray-500 text-sm mt-2">
                (Same type as referrer discount)
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={(e) => setFormData({...formData, active: e.target.checked})}
                className="mr-2"
              />
              Active Campaign
            </label>
          </div>

          <div className="flex items-center justify-between mt-6">
            <Link href="/dashboard">
              <a className="text-blue-500">Cancel</a>
            </Link>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}