/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Activity, Flame, Heart, ChevronRight, Apple, AlertCircle } from 'lucide-react';
import { Language, UserProfile } from '../types';

interface HealthAnalyticsProps {
  language: Language;
  userProfile: UserProfile | null;
  onUpdateBmi: (weight: number, height: number, bmi: number) => void;
}

export default function HealthAnalytics({ language, userProfile, onUpdateBmi }: HealthAnalyticsProps) {
  const [weight, setWeight] = useState(userProfile?.weight || 70);
  const [height, setHeight] = useState(userProfile?.height || 170);
  const [targetWeight, setTargetWeight] = useState(65);
  const [waterGlasses, setWaterGlasses] = useState(5);

  const calculateBMI = (w: number, h: number) => {
    const heightInMeters = h / 100;
    return parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));
  };

  const bmi = calculateBMI(weight, height);

  const getBmiStatus = (val: number) => {
    if (language === 'th') {
      if (val < 18.5) return { category: 'น้ำหนักน้อยกว่าเกณฑ์ (Underweight)', color: 'text-blue-500 bg-blue-50 border-blue-200' };
      if (val < 23) return { category: 'น้ำหนักปกติ สุขภาพดี (Healthy Weight)', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      if (val < 25) return { category: 'น้ำหนักเกินเกณฑ์ (Overweight)', color: 'text-amber-500 bg-amber-50 border-amber-200' };
      return { category: 'ภาวะอ้วน (Obese Class I/II)', color: 'text-red-500 bg-red-50 border-red-200' };
    } else {
      if (val < 18.5) return { category: 'Underweight', color: 'text-blue-500 bg-blue-50 border-blue-200' };
      if (val < 23) return { category: 'Healthy Weight', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
      if (val < 25) return { category: 'Overweight', color: 'text-amber-500 bg-amber-50 border-amber-200' };
      return { category: 'Obese', color: 'text-red-500 bg-red-50 border-red-200' };
    }
  };

  const status = getBmiStatus(bmi);

  // Customized clinical tips based on BMI category
  const getNutritionAdvice = (val: number) => {
    if (language === 'th') {
      if (val < 18.5) {
        return {
          calGoal: '2,200 kcal',
          tips: [
            'เน้นรับประทานอาหารประเภทโปรตีนคุณภาพสูงเพื่อเพิ่มมวลกล้ามเนื้อ',
            'แบ่งมื้ออาหารออกเป็น 5-6 มื้อย่อยต่อวัน เพิ่มอาหารว่างที่มีประโยชน์ เช่น ถั่วและธัญพืช',
            'รับประทานไขมันชนิดดี (HDL) เช่น อะโวคาโด น้ำมันมะกอก เพื่อเพิ่มพลังงานดีแก่ร่างกาย',
          ],
          idealProportion: 'โปรตีน 30% | คาร์โบไฮเดรต 50% | ไขมัน 20%'
        };
      }
      if (val < 23) {
        return {
          calGoal: '1,800 kcal',
          tips: [
            'รักษาความสมดุลด้วยสารอาหารที่ครบถ้วนทั้ง 5 หมู่ตามหลักโภชนาการทางการแพทย์',
            'รับประทานผักผลไม้สีรุ้งให้ได้ครึ่งหนึ่งของมื้ออาหาร เพื่อเพิ่มพฤกษเคมีและสารต้านอนุมูลอิสระ',
            'ดื่มน้ำสะอาดอย่างน้อยวันละ 2.5 ลิตร เพื่อรักษาความคงที่ของระดับการเผาผลาญ',
          ],
          idealProportion: 'โปรตีน 25% | คาร์โบไฮเดรต 50% | ไขมัน 25%'
        };
      }
      return {
        calGoal: '1,400 - 1,500 kcal',
        tips: [
          'หลีกเลี่ยงน้ำตาลขัดสีและอาหารแปรรูปอย่างเด็ดขาดเพื่อชะลอการหลั่งอินซูลิน',
          'เน้นการทำ Intermittent Fasting (IF) และเพิ่มการรับประทานผักที่มีกากใยสูง',
          'ปรึกษาอายุรแพทย์โรคต่อมไร้ท่อของ mydoctor หากมีภาวะดื้อต่ออินซูลินรุนแรง',
        ],
        idealProportion: 'โปรตีน 35% | คาร์โบไฮเดรต 35% | ไขมัน 30%'
      };
    } else {
      if (val < 18.5) {
        return {
          calGoal: '2,200 kcal',
          tips: [
            'Increase intake of lean proteins to rebuild muscle mass and skeletal density.',
            'Opt for dense calorie snack options such as unsalted nuts, seeds, and rich avocados.',
            'Avoid simple sugar beverages; focus on nutrient-rich smoothies with whey protein.',
          ],
          idealProportion: 'Protein 30% | Carbs 50% | Fats 20%'
        };
      }
      if (val < 23) {
        return {
          calGoal: '1,800 kcal',
          tips: [
            'Maintain nutrient balance across five essential medical food groups.',
            'Consume dynamic rainbow vegetables daily to fortify immune and metabolic pathways.',
            'Aim for 2.5L structured water hydration to support regular kidney and cell functions.',
          ],
          idealProportion: 'Protein 25% | Carbs 50% | Fats 25%'
        };
      }
      return {
        calGoal: '1,400 - 1,500 kcal',
        tips: [
          'Restrict processed high-fructose food strictly to prevent excessive insulin spikes.',
          'Emphasize high-fiber soluble prebiotics to improve gut barrier & lower bad LDL.',
          'Ensure dynamic aerobic exercises paired with mydoctor endocrine clinic checkups.',
        ],
        idealProportion: 'Protein 35% | Carbs 35% | Fats 30%'
      };
    }
  };

  const advice = getNutritionAdvice(bmi);

  const handleApplyBmiChanges = () => {
    onUpdateBmi(weight, height, bmi);
  };

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-xl space-y-6" id="health_analytics_module">
      {/* Title */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
          <Scale className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {language === 'th' ? 'โภชนาการและตัวชี้วัดสุขภาพ' : 'Nutrition & Health Analytics'}
          </h3>
          <span className="text-[10px] text-slate-400 font-mono block uppercase">Grid Module 05</span>
        </div>
      </div>

      {/* Input sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>{language === 'th' ? 'น้ำหนักตัว' : 'Weight'}</span>
              <span className="font-mono text-teal-700 font-bold">{weight} kg</span>
            </div>
            <input
              type="range"
              min="30"
              max="150"
              value={weight}
              onChange={(e) => {
                const w = parseInt(e.target.value);
                setWeight(w);
              }}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
              <span>{language === 'th' ? 'ส่วนสูง' : 'Height'}</span>
              <span className="font-mono text-teal-700 font-bold">{height} cm</span>
            </div>
            <input
              type="range"
              min="100"
              max="220"
              value={height}
              onChange={(e) => {
                const h = parseInt(e.target.value);
                setHeight(h);
              }}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
            />
          </div>

          <button
            onClick={handleApplyBmiChanges}
            className="w-full bg-teal-950 text-teal-100 hover:bg-teal-900 py-2.5 rounded-xl text-xs font-semibold transition-all border border-teal-800 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Activity className="w-4 h-4" />
            {language === 'th' ? 'บันทึกค่าตัวชี้วัดเข้าระบบ' : 'Save Health Metrics to EHR'}
          </button>
        </div>

        {/* BMI Dial Result */}
        <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col justify-center text-center relative overflow-hidden">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">
            {language === 'th' ? 'ดัชนีมวลกายปัจจุบัน' : 'CURRENT BODY MASS INDEX'}
          </span>
          <span className="text-4xl font-extrabold font-mono text-slate-950 tracking-tight">{bmi}</span>
          
          <div className={`mt-3 py-1.5 px-3 border rounded-xl text-xs font-semibold inline-block mx-auto ${status.color}`}>
            {status.category}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-1 text-[9px] font-mono text-slate-400">
            <div>
              <span className="block font-bold text-blue-500">&lt;18.5</span>
              <span>Thin</span>
            </div>
            <div>
              <span className="block font-bold text-emerald-600">18.5-22.9</span>
              <span>Normal</span>
            </div>
            <div>
              <span className="block font-bold text-amber-500">23-24.9</span>
              <span>Over</span>
            </div>
            <div>
              <span className="block font-bold text-red-500">25+</span>
              <span>Obese</span>
            </div>
          </div>
        </div>
      </div>

      {/* Customized clinical advice panel */}
      <div className="p-5 bg-teal-950 text-teal-100 border border-teal-900 rounded-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-teal-900 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Apple className="w-4.5 h-4.5 text-teal-400" />
            <span>{language === 'th' ? 'เป้าหมายโภชนาการทางการแพทย์' : 'Clinical Nutritional Targets'}</span>
          </div>
          <span className="font-mono text-teal-400 font-bold text-xs">{advice.calGoal}</span>
        </div>

        <div className="space-y-2.5 text-xs text-slate-200">
          {advice.tips.map((tip, index) => (
            <div key={index} className="flex gap-2 items-start leading-relaxed">
              <ChevronRight className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-teal-900 text-[10px] font-mono text-teal-300 text-center uppercase tracking-wider font-bold">
          {language === 'th' ? 'สัดส่วนสารอาหารแนะนำ:' : 'RECOMMENDED MACROS:'} {advice.idealProportion}
        </div>
      </div>

      {/* Dynamic water tracking widget */}
      <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-800">{language === 'th' ? 'การดื่มน้ำรายวัน' : 'Daily Water Hydration Tracker'}</h4>
          <span className="text-[10px] text-slate-400 block font-mono">Recommended: 8-10 glasses (2.5L)</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWaterGlasses((p) => Math.max(0, p - 1))}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all font-bold text-sm"
          >
            -
          </button>
          <div className="px-3 py-1 bg-teal-50 border border-teal-100 text-teal-700 font-mono font-bold text-sm rounded-lg min-w-[50px] text-center">
            {waterGlasses} 💧
          </div>
          <button
            onClick={() => setWaterGlasses((p) => p + 1)}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all font-bold text-sm"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
