"use client";

import { AnchorHTMLAttributes, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Calendar,
  Refrigerator,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });
  const howItWorksInView = useInView(howItWorksRef, { once: true });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const router = useRouter();
  const supabase = createClient();
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // TODO: image - 우리 웹사이트 이미지로 수정
  const features = [
    {
      title: "스마트 냉장고 관리",
      description: "유통기한을 자동 추적하고 식재료를 신선하게 관리해보세요",
      icon: Refrigerator,
      gradient: "from-green-400 to-green-600",
      image:
        "https://images.unsplash.com/photo-1606859191214-25806e8e2423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjByZWZyaWdlcmF0b3J8ZW58MXx8fHwxNzU4NjE3MjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "AI 맞춤 레시피 추천",
      description:
        "냉장고 속 재료와 취향을 분석해 딱 맞는 레시피를 AI가 똑똑하게 추천드려요",
      icon: Sparkles,
      gradient: "from-purple-400 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1586886802725-4b82dec7b2ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBwaG9uZSUyMGNvb2tpbmclMjByZWNpcGV8ZW58MXx8fHwxNzU4NjMxNjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "요리 기록 & 성장",
      description:
        "나만의 요리 히스토리를 기록하고 실력 향상 과정을 한눈에 확인하세요",
      icon: Calendar,
      gradient: "from-yellow-400 to-orange-500",
      image:
        "https://images.unsplash.com/photo-1699206332834-8fa9f45a906c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMGNvb2tpbmd8ZW58MXx8fHwxNzU4NjMxNjA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      title: "스마트 레시피 검색",
      description:
        "재료, 난이도별로 필터링해서 원하는 레시피를 빠르게 찾아보세요",
      icon: ChefHat,
      gradient: "from-blue-400 to-blue-600",
      image:
        "https://images.unsplash.com/photo-1606859191214-25806e8e2423?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjByZWZyaWdlcmF0b3J8ZW58MXx8fHwxNzU4NjE3MjgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ];

  const howItWorksSteps = [
    {
      step: "01",
      title: "냉장고 재료 등록",
      description: "냉장고 재료를 간단히 촬영하거나 직접 입력해보세요",
      icon: Refrigerator,
      color: "text-green-500",
    },
    {
      step: "02",
      title: "AI 레시피 추천",
      description: "보유 재료를 분석해 만들 수 있는 최적의 레시피를 추천받아요",
      icon: Sparkles,
      color: "text-purple-500",
    },
    {
      step: "03",
      title: "요리 & 기록",
      description: "레시피를 따라 요리하고 나만의 요리 기록을 확인해보세요",
      icon: ChefHat,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Gradients */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/30 to-green-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-yellow-400/20 to-yellow-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-400/20 to-purple-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-base bg-white/10 backdrop-blur-sm border-white/20"
            >
              ✨ 1인 가구를 위한 스마트 냉장고 관리 도우미
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-green-600 to-green-500 bg-clip-text text-transparent"
          >
            오늘의 냉장고
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            냉장고 속 재료를 똑똑하게 관리하고,
            <br />
            AI가 추천하는 맞춤 레시피로 맛있는 요리를 만들어보세요
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              onClick={handleClick}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Refrigerator className="w-5 h-5 mr-2" />
              지금 시작하기
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section ref={featuresRef} className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              왜 오늘의 냉장고일까요?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              스마트한 냉장고 관리와 요리 솔루션을 경험해보세요
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={featuresInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group h-full">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${feature.gradient} opacity-80`}
                      ></div>
                      <div className="absolute top-4 left-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="p-6">
                      <CardTitle className="text-xl mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section ref={howItWorksRef} className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              3단계로 시작하는 스마트 요리
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              복잡한 설정 없이 간단하게 시작할 수 있어요
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorksSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="text-center group"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`h-10 w-10 ${step.color}`} />
                    </div>
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              간단한 회원가입으로 모든 기능을 무료로 이용할 수 있습니다.
              <br />
              음식 낭비를 줄이고 요리 실력을 늘려보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={"/"}
                onClick={handleClick}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-green-600 bg-white hover:bg-gray-100 rounded-md shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                무료로 시작하기
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-[#374151] mb-4">
              자주 묻는 질문들
            </h2>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "정말 무료인가요?",
                answer:
                  "네, 모든 기능을 무료로 사용 가능해요. 추가 요금이나 숨겨진 비용은 전혀 없습니다.",
              },
              {
                question: "요리 초보도 할 수 있나요?",
                answer:
                  "물론이에요! 난이도 순으로 요리를 선택할 수 있어서 요리 초보도 실패할 수 없어요.",
              },
              {
                question: "어떤 재료든 관리되나요?",
                answer:
                  "야채, 육류, 유제품, 조미료까지 모든 식재료를 관리할 수 있어요.",
              },
              {
                question: "모바일에서도 되나요?",
                answer:
                  "네! 모바일 최적화로 언제 어디서나 편리하게 사용하실 수 있어요.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
                >
                  <span className="text-lg font-semibold text-[#374151]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#6B7280] transition-transform duration-200 ${
                      openFAQ === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFAQ === index && (
                  <div className="px-8 pb-6">
                    <p className="text-[#6B7280] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
