import React, { useState } from 'react';
import { PartnerWallet, Language } from '../types';
import {
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  CreditCard,
  Building2,
  CheckCircle2,
  Sparkles,
  Users,
  Copy,
  Check,
  ShieldCheck,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface PartnerWalletModalProps {
  wallet: PartnerWallet;
  currentLang: Language;
  onClose: () => void;
  onWithdraw: (amountUsd: number, method: string, accountDetails: string) => void;
  ownerEmail: string;
}

export const PartnerWalletModal: React.FC<PartnerWalletModalProps> = ({
  wallet,
  currentLang,
  onClose,
  onWithdraw,
  ownerEmail,
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'withdraw' | 'invite'>('balance');
  const [withdrawAmount, setWithdrawAmount] = useState('100');
  const [withdrawMethod, setWithdrawMethod] = useState<'stc_pay' | 'bank_iban' | 'paypal'>('stc_pay');
  const [accountDetails, setAccountDetails] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `https://moveconnect.sa/join?ref=${encodeURIComponent(ownerEmail.split('@')[0])}&reward=5usd`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (isNaN(amt) || amt <= 0 || amt > wallet.balanceUsd) return;

    onWithdraw(amt, withdrawMethod, accountDetails || 'الحساب المسجل في الملف');
    setWithdrawalSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 end-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 text-emerald-300 shadow-inner">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black">
                  {currentLang === 'ar'
                    ? 'محفظة الأرباح ومكافآت الدولارات'
                    : currentLang === 'ur'
                    ? 'آمدنی اور ڈالر والٹ'
                    : 'Partner Dollar Earnings & Wallet'}
                </h3>
                <span className="bg-emerald-400/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  LIVE EARNINGS
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                {currentLang === 'ar'
                  ? 'اربح دولارات فورية عند تسجيل دخول المستخدمين وحجز طلبات النقل عبر التطبيق'
                  : 'Earn real dollars on customer logins, app installs, and moving quote requests'}
              </p>
            </div>
          </div>

          {/* Wallet Balance Display */}
          <div className="bg-black/30 backdrop-blur-md rounded-2xl p-4.5 border border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                <span>{currentLang === 'ar' ? 'الرصيد المتاح للسحب' : 'Available Balance'}</span>
                <span className="text-[10px] bg-emerald-500/30 text-white px-2 py-0.5 rounded-md font-bold">
                  $1.00 = 3.75 SAR
                </span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  ${wallet.balanceUsd.toFixed(2)}
                </span>
                <span className="text-base sm:text-lg font-bold text-emerald-300">
                  ({wallet.balanceSar.toFixed(2)} ر.س)
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setWithdrawalSuccess(false);
                  setActiveTab('withdraw');
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105 cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                <span>{currentLang === 'ar' ? 'سحب الأرباح' : 'Cash Out'}</span>
              </button>
              <button
                onClick={() => setActiveTab('invite')}
                className="bg-white/15 hover:bg-white/25 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
              >
                <Users className="w-4 h-4" />
                <span>{currentLang === 'ar' ? 'رابط كسب $5' : 'Earn $5'}</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-emerald-200 block text-[11px]">
                {currentLang === 'ar' ? 'إجمالي الأرباح المكتسبة' : 'Total Earned'}
              </span>
              <span className="text-base font-black text-white mt-0.5 block">
                ${wallet.totalEarnedUsd.toFixed(2)} USD
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-2.5 border border-white/10">
              <span className="text-emerald-200 block text-[11px]">
                {currentLang === 'ar' ? 'إجمالي ما تم سحبه بنجاح' : 'Total Withdrawn'}
              </span>
              <span className="text-base font-black text-emerald-300 mt-0.5 block">
                ${wallet.totalWithdrawnUsd.toFixed(2)} USD
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-200 px-6 flex gap-6 text-xs sm:text-sm font-bold text-slate-600 bg-slate-50">
          <button
            onClick={() => setActiveTab('balance')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'balance'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {currentLang === 'ar' ? 'سجل العمليات والأرباح' : 'Earnings History'}
          </button>
          <button
            onClick={() => {
              setWithdrawalSuccess(false);
              setActiveTab('withdraw');
            }}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'withdraw'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {currentLang === 'ar' ? 'طلب سحب رصيد (STC Pay / بنك)' : 'Withdraw Funds'}
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'invite'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {currentLang === 'ar' ? 'برنامج المكافآت ($5 لكل تسجيل)' : 'Reward Rates ($5/login)'}
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto max-h-[55vh] space-y-4">
          {/* TAB 1: BALANCE & TRANSACTIONS */}
          {activeTab === 'balance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span>{currentLang === 'ar' ? 'تفاصيل المكافآت الأخيرة' : 'Recent Transactions'}</span>
                <span>{wallet.transactions.length} {currentLang === 'ar' ? 'عمليات مسجلة' : 'records'}</span>
              </div>

              <div className="space-y-2.5">
                {wallet.transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-colors flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          tx.amountUsd >= 0
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {tx.amountUsd >= 0 ? (
                          <ArrowDownLeft className="w-5 h-5" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-900">{tx.title}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          <span>{tx.date}</span>
                          {tx.customerName && (
                            <>
                              <span>•</span>
                              <span className="text-slate-600 font-medium">العميل: {tx.customerName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-end shrink-0">
                      <div
                        className={`text-sm font-black ${
                          tx.amountUsd >= 0 ? 'text-emerald-600' : 'text-slate-900'
                        }`}
                      >
                        {tx.amountUsd >= 0 ? `+ $${tx.amountUsd.toFixed(2)}` : `- $${Math.abs(tx.amountUsd).toFixed(2)}`}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {tx.amountSar >= 0 ? `+ ${tx.amountSar.toFixed(2)} ر.س` : `- ${Math.abs(tx.amountSar).toFixed(2)} ر.س`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: WITHDRAWAL */}
          {activeTab === 'withdraw' && (
            <div className="space-y-4">
              {withdrawalSuccess ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">
                    {currentLang === 'ar' ? 'تم استلام طلب السحب بنجاح!' : 'Withdrawal Request Submitted!'}
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    {currentLang === 'ar'
                      ? `تم خصم $${withdrawAmount} (${(parseFloat(withdrawAmount) * 3.75).toFixed(2)} ر.س) وجاري إرسال الحوالة فوراً عبر ${withdrawMethod.toUpperCase()}. ستصلك رسالة تأكيد على البريد والجوال.`
                      : `Successfully processed withdrawal of $${withdrawAmount}. Funds are transferred via ${withdrawMethod}.`}
                  </p>
                  <button
                    onClick={() => setActiveTab('balance')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl cursor-pointer"
                  >
                    {currentLang === 'ar' ? 'العودة للمحفظة' : 'View Wallet'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleWithdrawSubmit} className="space-y-4 text-xs">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-amber-900">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold">سحب فوري بدون رسوم تحويل إضافية</div>
                      <div className="text-[11px] text-amber-800 mt-0.5">
                        يمكنك تحويل رصيدك بالدولار أو بالريال السعودي إلى حساب STC Pay أو الحسابات البنكية السعودية (الراجحي، الأهلي، الإنماء) خلال دقائق.
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {currentLang === 'ar' ? 'المبلغ المراد سحبه بالدولار ($)' : 'Amount in USD ($)'}
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
                      <input
                        type="number"
                        min="10"
                        max={wallet.balanceUsd}
                        step="5"
                        required
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full p-2.5 ps-9 rounded-xl border border-slate-300 font-black text-slate-900 text-base"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1 flex justify-between">
                      <span>الحد الأدنى للسحب: $10.00</span>
                      <span className="font-bold text-emerald-700">
                        يعادل تقريباً: {((parseFloat(withdrawAmount) || 0) * 3.75).toFixed(2)} ر.س
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {currentLang === 'ar' ? 'طريقة استلام الأرباح' : 'Payout Method'}
                    </label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('stc_pay')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          withdrawMethod === 'stc_pay'
                            ? 'border-purple-600 bg-purple-50 text-purple-900 font-black ring-1 ring-purple-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">STC Pay</div>
                        <div className="text-[10px] text-slate-500">تحويل فوري برقم الجوال</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('bank_iban')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          withdrawMethod === 'bank_iban'
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-black ring-1 ring-emerald-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">آيبان بنكي (IBAN)</div>
                        <div className="text-[10px] text-slate-500">الراجحي / الأهلي / الإنماء</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setWithdrawMethod('paypal')}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          withdrawMethod === 'paypal'
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-black ring-1 ring-blue-600'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">PayPal / USDT</div>
                        <div className="text-[10px] text-slate-500">دولي بالدولار</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {withdrawMethod === 'stc_pay'
                        ? 'رقم جوال STC Pay المسجل (مثال: 0501234567)'
                        : withdrawMethod === 'bank_iban'
                        ? 'رقم الآيبان البنكي (SA...)'
                        : 'البريد الإلكتروني لحساب PayPal أو عنوان محفظة USDT'}
                    </label>
                    <input
                      type="text"
                      required
                      value={accountDetails}
                      onChange={(e) => setAccountDetails(e.target.value)}
                      placeholder={
                        withdrawMethod === 'stc_pay'
                          ? '0501234567'
                          : withdrawMethod === 'bank_iban'
                          ? 'SA0380000000608010167519'
                          : 'sakhilhomemovingservices@gmail.com'
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold"
                      dir="ltr"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3 rounded-xl shadow-md transition-colors cursor-pointer text-sm"
                  >
                    تأكيد سحب ${withdrawAmount} ({((parseFloat(withdrawAmount) || 0) * 3.75).toFixed(2)} ر.س)
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REWARD RATES & REFERRAL LINK */}
          {activeTab === 'invite' && (
            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 space-y-2">
                <div className="font-black text-slate-900 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>جدول مكافآت الشركاء بالدولار في MoveConnect</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  يتم إيداع الأرباح تلقائياً في محفظتك عند حدوث أي من العمليات التالية من خلال رابطك أو تطبيقك:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">تسجيل دخول مستخدم جديد</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      + $5.00
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    لكل عميل يدخل على التطبيق أو يسجل حسابه لأول مرة.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">طلب عرض سعر نقل مؤكد</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      + $15.00
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    عندما يقوم العميل بإرسال طلب عرض سعر لمنشأتك.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">تثبيت التطبيق من Google Play</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      + $10.00
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    لكل عميل يقوم بتثبيت تطبيق MoveConnect على جواله.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 bg-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">إتمام حجز نقل عفش</span>
                    <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      + $25.00
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    حافز تنفيذ العملية وتقييم العميل الإيجابي 5 نجوم.
                  </p>
                </div>
              </div>

              {/* Referral Link Box */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <label className="block font-bold text-slate-800">
                  رابط الإحالة المباشر الخاص بك (اربح $5 لكل شخص يفتحه ويسجل الدخول):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-mono text-[11px]"
                    dir="ltr"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'تم النسخ!' : 'نسخ الرابط'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
