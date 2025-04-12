import { useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Earth } from './components/Earth';
import { StarField } from './components/StarField';
import { Navigation } from './components/Navigation';
import { ParticleText } from './components/ParticleText';
import { SunGem } from './components/SunGem';
import { MoonGem } from './components/MoonGem';
import { BlueGem } from './components/BlueGem';
import { Footer } from './components/Footer';
import { Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-black text-white">
      <Navigation />
      
      {/* Hero Section with Fixed Earth and Stars */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Earth />
          <StarField />
        </Canvas>
      </div>
      
      {/* Content Sections */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="relative z-10 text-center">
          <ParticleText />
          <Rocket className="w-12 h-12 mx-auto animate-bounce mt-8" />
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="relative min-h-screen p-4 md:p-20">
        <div className="absolute left-0 bottom-0 w-full md:w-[600px] h-[300px] md:h-[600px] opacity-75">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Environment preset="sunset" />
            <SunGem />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 ml-0 md:ml-auto max-w-full md:max-w-4xl px-4 md:px-0 pt-[300px] md:pt-0"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">MISSION</h2>
          <div className="space-y-4 md:space-y-6">
            <p className="text-base md:text-lg leading-relaxed text-gray-300">
              私たちは、テクノロジーを通じて人々の生活をより豊かにすることを目指しています。
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-300">
              ユーザーにとって価値のあるサービスを提供し、社会に貢献することで、
              持続可能な成長を実現します。
            </p>
            <p className="text-base md:text-lg leading-relaxed text-gray-300">
              常に最新のテクノロジーを追求し、革新的なソリューションを生み出すことで、
              クライアントとユーザーの期待を超える価値を創造します。
            </p>
          </div>
        </motion.div>
      </section>

      {/* Works Section */}
      <section id="works" className="relative min-h-screen p-4 md:p-20">
        <div className="absolute left-0 bottom-0 w-full md:w-[600px] h-[300px] md:h-[600px] opacity-75">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Environment preset="night" />
            <MoonGem />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 ml-0 md:ml-auto max-w-full md:max-w-4xl px-4 md:px-0 pt-[300px] md:pt-0"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">WORKS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 md:p-8 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">受託開発</h3>
              <p className="text-sm md:text-base text-gray-300">
                Webアプリケーション、スマートフォンアプリケーション、業務システムなど、
                お客様のニーズに合わせた最適なソリューションを提供します。
              </p>
            </motion.div>
            <motion.div
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 md:p-8 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">自社プロダクト開発</h3>
              <p className="text-sm md:text-base text-gray-300">
                独自のプロダクトを開発し、新しい価値を創造します。
                ユーザーのニーズを的確に捉え、使いやすく革新的なサービスを提供します。
              </p>
            </motion.div>
            <motion.div
              className="bg-white/5 backdrop-blur-lg rounded-lg p-6 md:p-8 hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">技術支援</h3>
              <p className="text-sm md:text-base text-gray-300">
                最新のテクノロジーを活用したシステム設計、開発支援、技術コンサルティングを提供し、
                お客様のプロジェクトの成功をサポートします。
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative min-h-screen p-4 md:p-20">
        <div className="absolute left-0 bottom-0 w-full md:w-[600px] h-[300px] md:h-[600px] opacity-75">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Environment preset="dawn" />
            <BlueGem />
            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 ml-0 md:ml-auto max-w-full md:max-w-4xl px-4 md:px-0 pt-[300px] md:pt-0"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">TEAM</h2>
          <div className="max-w-full md:max-w-3xl mb-8 md:mb-12">
            <p className="text-base md:text-lg leading-relaxed text-gray-300">
              私たちは、情熱的なエンジニアとデザイナーのチームです。
              一人ひとりが高い専門性と創造性を持ち、
              最新のテクノロジーとベストプラクティスを活用して、
              クライアントの課題解決に取り組んでいます。
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-white/10 mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-bold mb-1 md:mb-2">Team Member {i}</h3>
                <p className="text-xs md:text-sm text-gray-300">Position</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* News & Blogs Section */}
      <section id="news" className="relative min-h-screen p-4 md:p-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-full md:max-w-4xl mx-auto px-4 md:px-0"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">NEWS & BLOGS</h2>
          <div className="grid grid-cols-1 gap-6 md:gap-8">
            {['NEWS', 'BLOG', 'TECH BLOG'].map((category) => (
              <div key={category}>
                <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{category}</h3>
                <div className="space-y-3 md:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <motion.a
                      key={i}
                      href="#"
                      className="block p-4 md:p-6 bg-white/5 backdrop-blur-lg rounded-lg hover:bg-white/10 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 md:gap-0">
                        <h4 className="text-base md:text-lg font-bold">{category} Title {i}</h4>
                        <span className="text-xs md:text-sm text-gray-400">2024.03.{i}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-300 mt-2">
                        最新の技術トレンドと私たちの取り組みについての記事です。
                      </p>
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

export default App;