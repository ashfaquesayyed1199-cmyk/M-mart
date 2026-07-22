import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, Truck, ShieldCheck, Clock, Tag, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Banner, Category, Product } from '@/types';
import ProductCard from '@/components/ProductCard';
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/ui/Spinner';

export default function HomePage() {
  const { settings } = useSettings();
  const { user, profile } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const [b, c, f] = await Promise.all([
        supabase.from('banners').select('*').eq('active', true).order('position', { ascending: true }),
        supabase.from('categories').select('*').order('sort_order', { ascending: true }),
        supabase.from('products').select('*, product_images(*)').order('created_at', { ascending: false }).limit(10),
      ]);
      setBanners((b.data?? []) as Banner[]);
      setCategories((c.data?? []) as Category[]);
      setFeatured((f.data?? []) as Product[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const t = setInterval(() => setSlide((s) => (s + 1) % banners.length), 5000);
    return () => clearInterval(t);
  }, [banners.length]);

  const heroBanner = banners[slide];
  const greeting = user? `Hi, ${profile?.full_name?.split(' ')[0] || 'there'}` : 'Welcome to Mahapoli Mart';

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Spinner /></div>;
  }

  return (
    <div className="bg-slate-50">
      {/* Header + Search */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pt-6 pb-4">
          <h1 className="text-2xl font-extrabold text-slate-900">{greeting}</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            }}
            className="relative mt-4"
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e
