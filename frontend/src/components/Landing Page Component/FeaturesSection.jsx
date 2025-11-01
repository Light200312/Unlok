import React from 'react';

const features = [
    {
        title: "Personalized User Stats",
        description: "Track your strength, stamina, IQ, EQ, and more with tailored insights.",
        className: "col-span-5 md:col-span-2",
        img : "../../../public/radar.jpg"
    },
    {
        title: "Daily, Weekly, Monthly Challenges",
        description: "Engage in challenges to build your character and boost your stats.",
        className: "col-span-5 md:col-span-3",
        img : "../../../public/quest.jpg"
    },
    {
        title: "Global Ranking of Users",
        description: "See where you stand among users worldwide.",
        className: "col-span-5 md:col-span-3",
        img : "../../../public/ranking.jpg"
    },
    {
        title: "Community to Share Progress",
        description: "Create together , Work together , grow together",
        className: "col-span-5 md:col-span-2",
        img : "../../../public/share.jpg"
    }
];

const FeatureCard = ({ title, description, className, placeholderImage }) => {
    return (
        <div
            className={`rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden min-h-[300px] shadow-lg ${className}`}
            style={{
                backgroundImage: `url(${placeholderImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-all duration-300"></div>

            <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white">{title}</h3>
                <p className="text-gray-200 mt-2 text-sm">{description}</p>
            </div>
        </div>
    );
};
export default function FeaturesSection() {
    return (
        <div className='w-full flex flex-col items-center justify-center p-8 md:p-12 lg:py-24 bg-[#06000f] text-white'>
            <h1 className='text-center text-4xl md:text-5xl font-semibold mb-5'>
                A powerful toolkit for success
            </h1>
            <p className="text-2xl text-white/70 max-w-lg mx-auto mb-8 text-center text-nowrap">Features</p>
            <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-5 gap-6">
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.title}
                        title={feature.title}
                        description={feature.description}
                        className={feature.className}
                        placeholderImage={feature.img}
                    />
                ))}
            </div>

        </div>
    );
}
