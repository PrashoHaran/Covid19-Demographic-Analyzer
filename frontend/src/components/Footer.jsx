import React from 'react'
import {Globe} from 'lucide-react';

const Footer = () => {
    return (
        <div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-3 mb-6 md:mb-0">
                            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                                <Globe className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-xl font-bold">Covid-19 Representation</div>
                                <div className="text-gray-400">Data Visualization Platform</div>
                            </div>
                        </div>
                        <div className="text-gray-400 text-center md:text-right">
                            <p>© {new Date().getFullYear()} Covid-19 Representation Project</p>
                            <p className="mt-2">Contributions welcome on GitHub</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer