"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { MapPin, ChevronLeft, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getUser, upUser } from "@/services/userServices";
import Loading, { Spinner } from "@/components/Loading";
import dynamic from "next/dynamic";

const LocationPicker = dynamic(() => import("@/components/LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-muted rounded-lg animate-pulse" />
  ),
});

export default function UserInfoUpdatePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    zip: "",
    phone: "",
    googleMapsLink: undefined as string | undefined,
    latitude: undefined as number | undefined,
    longitude: undefined as number | undefined,
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function fetchShipping() {
      if (!session?.user?.email) {
        setFetching(false);
        return;
      }
      try {
        const result = await getUser(session.user.email);
        if (result?.shippingInfo) {
          setShipping({
            address: result.shippingInfo.address || "",
            city: result.shippingInfo.city || "",
            zip: result.shippingInfo.zip || "",
            phone: result.shippingInfo.phone || "",
            googleMapsLink: result.shippingInfo.googleMapsLink,
            latitude: result.shippingInfo.latitude,
            longitude: result.shippingInfo.longitude,
          });
        }
      } catch (error) {
        toast.error("حدث خطأ غير متوقع");
      } finally {
        setFetching(false);
      }
    }
    fetchShipping();
  }, [session?.user?.email]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.email) return toast.error("يرجى تسجيل الدخول أولاً");

    setLoading(true);
    try {
      const result = await upUser(session.user.email, {
        shippingInfo: shipping,
      });

      if (result.success) {
        toast.success("تم تحديث البروفيل");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        toast.error("فشل التحديث", { description: result.error });
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("المتصفح لا يدعم تحديد الموقع");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Use OpenStreetMap Nominatim for reverse geocoding (free)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=ar`,
          );
          const data = await response.json();

          if (data.address) {
            const googleMapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
            setShipping({
              ...shipping,
              address: data.display_name || "",
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              zip: data.address.postcode || "",
              googleMapsLink,
              latitude,
              longitude,
            });
            toast.success("تم تحديد موقعك بنجاح");
          }
        } catch (error) {
          toast.error("فشل في الحصول على تفاصيل الموقع");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        setGettingLocation(false);
        toast.error("فشل في الحصول على الموقع. يرجى التحقق من الأذونات.");
      },
    );
  };

  const handleMapLocationSelect = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`,
      );
      const data = await response.json();

      if (data.address) {
        const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;
        setShipping({
          ...shipping,
          address: data.display_name || "",
          city:
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "",
          zip: data.address.postcode || "",
          googleMapsLink,
          latitude: lat,
          longitude: lng,
        });
        toast.success("تم تحديد الموقع من الخريطة");
        setShowMap(false);
      }
    } catch (error) {
      toast.error("فشل في الحصول على تفاصيل الموقع");
    }
  };

  if (fetching) {
    return <Loading size="lg" text="جاري التحميل..." />;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* MATCHED HEADER STYLE */}
      <header className="sticky top-0 z-50 bg-card/80 md:backdrop-blur-md border-b border-border px-5 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/profile"
              className="flex items-center justify-center bg-primary/10 p-2 rounded-lg hover:bg-primary/20 transition-all group"
            >
              <ChevronLeft size={18} className="text-primary rotate-180" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-foreground uppercase tracking-tighter">
                تعديل <span className="text-primary">البروفيل</span>
              </h1>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                إعدادات العنوان
              </p>
            </div>
          </div>

          <div className="hidden sm:flex bg-muted px-3 py-1.5 rounded-lg border border-border">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter ">
              ID: {session?.user?.email?.split("@")[0]}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto p-4 md:p-6">
        <div className="bg-card rounded-sm border border-border shadow-sm overflow-hidden">
          {/* Header Internal Banner */}
          <div className="p-6 bg-primary/5 border-b border-border flex items-center gap-4">
            <div className="bg-primary p-3 rounded-2xl text-primary-foreground">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                أمن البيانات
              </p>
              <p className="text-xs text-muted-foreground font-bold">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="p-6 space-y-5">
            {/* Location Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGetLocation}
                disabled={gettingLocation}
                className="bg-muted hover:bg-muted/80 text-foreground font-black py-3 rounded-lg border-2 border-dashed border-border hover:border-primary transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2 uppercase tracking-tighter text-xs"
              >
                {gettingLocation ? (
                  <Spinner size="sm" />
                ) : (
                  <MapPin size={16} className="text-primary" />
                )}
                {gettingLocation ? "جاري..." : "موقعي الحالي"}
              </button>

              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="bg-primary/10 hover:bg-primary/20 text-primary font-black py-3 rounded-lg border-2 border-primary/20 hover:border-primary transition-all active:scale-[0.98] flex justify-center items-center gap-2 uppercase tracking-tighter text-xs"
              >
                <MapPin size={16} />
                اختر من الخريطة
              </button>
            </div>

            {/* Street Address */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">
                عنوان الشارع
              </label>
              <input
                type="text"
                className="w-full p-3 bg-muted border border-border rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold text-foreground"
                value={shipping.address}
                onChange={(e) =>
                  setShipping({ ...shipping, address: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">
                  المدينة
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-muted border border-border rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold text-foreground"
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping({ ...shipping, city: e.target.value })
                  }
                  required
                />
              </div>

              {/* ZIP */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">
                  الرمز البريدي
                </label>
                <input
                  type="text"
                  className="w-full p-3 bg-muted border border-border rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold text-foreground"
                  value={shipping.zip}
                  onChange={(e) =>
                    setShipping({ ...shipping, zip: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mr-1">
                رقم التواصل
              </label>
              <input
                type="tel"
                className="w-full p-3 bg-muted border border-border rounded-2xl focus:border-primary outline-none transition-all text-sm font-bold text-foreground"
                value={shipping.phone || ""}
                onChange={(e) =>
                  setShipping({ ...shipping, phone: e.target.value })
                }
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:opacity-90 text-primary-foreground font-black py-3 rounded-lg shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-3 mt-4 uppercase tracking-tighter text-xs "
            >
              {loading ? <Spinner size="sm" /> : <Save size={18} />}
              {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
            </button>
          </form>
        </div>

        <p className="text-center text-muted-foreground text-[9px] font-black uppercase tracking-[0.3em] mt-8">
          بروتوكول آمن • المزامنة السحابية نشطة
        </p>
      </main>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-black text-foreground uppercase tracking-tighter">
                اختر <span className="text-primary">موقعك</span>
              </h2>
              <button
                onClick={() => setShowMap(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="rotate-180" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-4">
                انقر على الخريطة لتحديد موقعك بدقة
              </p>
              <LocationPicker onLocationSelect={handleMapLocationSelect} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
