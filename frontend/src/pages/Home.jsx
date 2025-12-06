import { useState, useEffect } from 'react';
import { BarChart3, Map, TrendingUp, Users, Shield, Activity, Globe, Database, Code, Github } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    datasets: 8,
    visualizations: 15,
    countries: 150,
    updates: 'Daily'
  });
  
  const [user, setUser] = useState(null); // Simulated user state

  const features = [
    {
      icon: <Map className="w-8 h-8" />,
      title: "Interactive Maps",
      description: "Geospatial visualization of COVID-19 spread across countries with real-time updates"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Analytical Dashboards",
      description: "Comprehensive charts and graphs showing infection rates, vaccination progress, and recovery trends"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trend Analysis",
      description: "Predictive models and trend analysis based on historical COVID-19 data"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Demographic Insights",
      description: "Breakdown of COVID-19 impact across different age groups and demographics"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Vaccination Tracking",
      description: "Global vaccine distribution and administration statistics"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Live data feeds from trusted sources including WHO and government databases"
    }
  ];

  const techStack = [
    { name: "Python", color: "bg-blue-500" },
    { name: "React", color: "bg-cyan-500" },
    { name: "D3.js", color: "bg-yellow-500" },
    { name: "Plotly", color: "bg-purple-500" },
    { name: "Pandas", color: "bg-red-500" },
    { name: "Flask", color: "bg-gray-500" },
    { name: "MongoDB", color: "bg-green-500" },
    { name: "Leaflet", color: "bg-emerald-500" }
  ];

  useEffect(() => {
    // Simulate fetching user data
    const mockUser = localStorage.getItem('user') 
      ? JSON.parse(localStorage.getItem('user'))
      : null;
    setUser(mockUser);
    
    // Simulate stats animation
    const timer = setTimeout(() => {
      setStats({
        datasets: 12,
        visualizations: 18,
        countries: 180,
        updates: 'Live'
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Visualizing the{' '}
              <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                Pandemic
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              An interactive platform for comprehensive COVID-19 data representation, 
              featuring real-time visualizations, analytical dashboards, and predictive insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                Explore Dashboard
              </button>
              
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-700 rounded-3xl transform rotate-6"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-6 rounded-2xl">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                    <div className="text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
                <Database className="w-8 h-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-gray-900">Live Data Integration</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Integrated with multiple trusted data sources for accurate and up-to-date information
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gradient-to-b from-white to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for{" "}
              <span className="bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
                Data Analysis
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive tools and visualizations to understand and analyze the global pandemic impact
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-cyan-400 rounded-xl flex items-center justify-center text-white mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Start Exploring COVID-19 Data Today
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join researchers, analysts, and health professionals in understanding the pandemic through data-driven insights
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:shadow-2xl transition-all transform hover:scale-105 text-lg font-semibold">
                Launch Interactive Dashboard
              </button>
              
            </div>
          </div>
        </div>
      </section>

    
    </div>
  );
};

export default Home;