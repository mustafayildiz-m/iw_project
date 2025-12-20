import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import axios from 'axios';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ReactSelect from 'react-select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Upload, Video, Image, Loader2 } from 'lucide-react';

// Validation Schema
const schema = yup.object({
  title: yup.string().required('Başlık zorunludur').min(3, 'Başlık en az 3 karakter olmalıdır'),
  description: yup.string().required('Açıklama zorunludur').min(10, 'Açıklama en az 10 karakter olmalıdır'),
  video_url: yup.string().url('Geçerli bir video URL\'i giriniz'),
  duration: yup.number().positive('Süre pozitif bir sayı olmalıdır'),
  language: yup.string().required('Dil seçimi zorunludur'),
  scholar_id: yup.number().required('Alim seçimi zorunludur').positive('Geçerli bir alim seçiniz'),
  is_active: yup.boolean(),
  is_featured: yup.boolean(),
});

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function AlimHikayesiDuzenle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scholars, setScholars] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scholarsLoading, setScholarsLoading] = useState(true);
  const [languagesLoading, setLanguagesLoading] = useState(true);
  const [storyLoading, setStoryLoading] = useState(true);
  const [currentStory, setCurrentStory] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_active: true,
      is_featured: false,
      language: 'tr'
    }
  });

  const watchedValues = watch();

  // Fetch scholars
  useEffect(() => {
    const fetchScholars = async () => {
      try {
        setScholarsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/scholars`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          },
          params: {
            limit: 1000 // Tüm alimleri getir
          }
        });
        
        // Backend { scholars: [...], totalCount, ... } formatında döndürüyor
        const scholarsData = response.data?.scholars || response.data || [];
        setScholars(Array.isArray(scholarsData) ? scholarsData : []);
      } catch (error) {
        toast.error('Alimler yüklenirken bir hata oluştu');
        setScholars([]); // Hata durumunda boş array
      } finally {
        setScholarsLoading(false);
      }
    };

    fetchScholars();
  }, []);

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        setLanguagesLoading(true);
        const response = await axios.get(`${API_BASE_URL}/languages`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        
        setLanguages(response.data || []);
      } catch (error) {
        toast.error('Diller yüklenirken bir hata oluştu');
        setLanguages([]);
      } finally {
        setLanguagesLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Thumbnail preview oluştur
  useEffect(() => {
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(thumbnailFile);
    } else if (currentStory?.thumbnail_url) {
      // Mevcut thumbnail'i göster - backend URL'ini tam path'e çevir
      const thumbnailUrl = currentStory.thumbnail_url.startsWith('http') 
        ? currentStory.thumbnail_url 
        : `${API_BASE_URL}${currentStory.thumbnail_url.startsWith('/') ? '' : '/'}${currentStory.thumbnail_url}`;
      
      setThumbnailPreview(thumbnailUrl);
    } else {
      setThumbnailPreview('');
    }
  }, [thumbnailFile, currentStory]);

  // Fetch current story
  useEffect(() => {
    const fetchStory = async () => {
      try {
        setStoryLoading(true);
        const response = await axios.get(`${API_BASE_URL}/scholar-stories/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        const story = response.data;
        setCurrentStory(story);

        // Set form values
        reset({
          title: story.title,
          description: story.description,
          video_url: story.video_url,
          duration: story.duration,
          language: story.language,
          scholar_id: story.scholar_id,
          is_active: story.is_active,
          is_featured: story.is_featured,
        });
      } catch (error) {
        toast.error('Hikaye yüklenirken bir hata oluştu');
        navigate('/alim-hikayeleri/liste');
      } finally {
        setStoryLoading(false);
      }
    };

    if (id) {
      fetchStory();
    }
  }, [id, navigate, reset]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('language', data.language);
      formData.append('scholar_id', data.scholar_id);
      formData.append('is_active', data.is_active);
      formData.append('is_featured', data.is_featured);
      
      if (data.video_url) {
        formData.append('video_url', data.video_url);
      }
      
      if (data.duration) {
        formData.append('duration', data.duration);
      }
      
      // Thumbnail dosyasını ekle
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }

      const response = await axios.patch(`${API_BASE_URL}/scholar-stories/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Alim hikayesi başarıyla güncellendi!');
      navigate('/alim-hikayeleri/liste');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Hikaye güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDurationChange = (value) => {
    const minutes = parseInt(value) || 0;
    const seconds = minutes * 60;
    setValue('duration', seconds);
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    return minutes.toString();
  };

  if (storyLoading) {
    return (
      <>
        <Helmet>
          <title>Hikaye Düzenle - Islamic Windows Admin</title>
        </Helmet>
        
        <div className="container mx-auto p-6 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Hikaye yükleniyor...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!currentStory) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Hikaye bulunamadı</p>
          <Button 
            className="mt-4" 
            onClick={() => navigate('/alim-hikayeleri/liste')}
          >
            Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Hikaye Düzenle - Islamic Windows Admin</title>
      </Helmet>
      
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/alim-hikayeleri/liste')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Hikaye Düzenle</h1>
          <p className="text-muted-foreground">
            "{currentStory.title}" hikayesini düzenleyin
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Temel Bilgiler */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Temel Bilgiler
            </CardTitle>
            <CardDescription>
              Hikayenin temel bilgilerini güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  {...register('title')}
                  placeholder="Örn: İmam Gazali Hayatı"
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="scholar_id">Alim Seçimi *</Label>
                <ReactSelect
                  options={scholars.map(scholar => ({
                    value: scholar.id,
                    label: scholar.fullName
                  }))}
                  value={scholars.find(scholar => scholar.id === watch('scholar_id')) ? {
                    value: watch('scholar_id'),
                    label: scholars.find(scholar => scholar.id === watch('scholar_id'))?.fullName
                  } : null}
                  onChange={(selectedOption) => {
                    setValue('scholar_id', selectedOption ? selectedOption.value : '');
                  }}
                  placeholder={scholarsLoading ? "Alimler yükleniyor..." : "Alim seçiniz"}
                  isSearchable={true}
                  isClearable={true}
                  isLoading={scholarsLoading}
                  noOptionsMessage={() => "Alim bulunamadı"}
                  className={errors.scholar_id ? 'border-red-500' : ''}
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: '40px',
                      borderColor: errors.scholar_id ? '#ef4444' : base.borderColor,
                      backgroundColor: 'hsl(var(--background))',
                      color: 'hsl(var(--foreground))',
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: 'hsl(var(--muted-foreground))',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: 'hsl(var(--foreground))',
                    }),
                    input: (base) => ({
                      ...base,
                      color: 'hsl(var(--foreground))',
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused 
                        ? 'hsl(var(--accent))' 
                        : state.isSelected 
                        ? 'hsl(var(--primary))' 
                        : 'transparent',
                      color: state.isSelected 
                        ? 'hsl(var(--primary-foreground))' 
                        : 'hsl(var(--foreground))',
                      '&:hover': {
                        backgroundColor: 'hsl(var(--accent))',
                        color: 'hsl(var(--accent-foreground))',
                      },
                    }),
                    noOptionsMessage: (base) => ({
                      ...base,
                      color: 'hsl(var(--muted-foreground))',
                    }),
                    loadingMessage: (base) => ({
                      ...base,
                      color: 'hsl(var(--muted-foreground))',
                    }),
                  }}
                />
                {errors.scholar_id && (
                  <p className="text-sm text-red-500">{errors.scholar_id.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Hikayenin detaylı açıklamasını yazın..."
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Dil *</Label>
                <Select
                  onValueChange={(value) => setValue('language', value)}
                  value={watchedValues.language}
                  disabled={languagesLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={languagesLoading ? "Diller yükleniyor..." : "Dil seçiniz"} />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.length === 0 && !languagesLoading ? (
                      <SelectItem value="" disabled>Dil bulunamadı</SelectItem>
                    ) : (
                      languages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {errors.language && (
                  <p className="text-sm text-red-500">{errors.language.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Süre (Dakika)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="30"
                  value={formatDuration(watchedValues.duration)}
                  onChange={(e) => handleDurationChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medya Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Medya Bilgileri
            </CardTitle>
            <CardDescription>
              Video URL'i ve kapak resmini güncelleyin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input
                id="video_url"
                {...register('video_url')}
                placeholder="https://example.com/video.mp4"
                className={errors.video_url ? 'border-red-500' : ''}
              />
              {errors.video_url && (
                <p className="text-sm text-red-500">{errors.video_url.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Kapak Resmi Güncelle</Label>
              <div className="flex items-center gap-4">
                {thumbnailPreview && (
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={thumbnailPreview} 
                      alt="Kapak önizleme" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setThumbnailFile(file);
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Yeni kapak resmi yükleyin (JPG, PNG) - Mevcut: {currentStory?.thumbnail_url ? '✅ Var' : '❌ Yok'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ayarlar */}
        <Card>
          <CardHeader>
            <CardTitle>Ayarlar</CardTitle>
            <CardDescription>
              Hikayenin görünürlük ve öne çıkarma ayarları
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Aktif</Label>
                <p className="text-sm text-muted-foreground">
                  Hikayenin görünür olup olmayacağını belirler
                </p>
              </div>
              <Switch
                id="is_active"
                checked={watchedValues.is_active}
                onCheckedChange={(checked) => setValue('is_active', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_featured">Öne Çıkan</Label>
                <p className="text-sm text-muted-foreground">
                  Hikayeyi öne çıkan hikayeler arasında göster
                </p>
              </div>
              <Switch
                id="is_featured"
                checked={watchedValues.is_featured}
                onCheckedChange={(checked) => setValue('is_featured', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* İstatistikler */}
        <Card>
          <CardHeader>
            <CardTitle>İstatistikler</CardTitle>
            <CardDescription>
              Hikayenin performans verileri
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentStory.view_count || 0}</div>
                <div className="text-sm text-muted-foreground">Görüntülenme</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentStory.like_count || 0}</div>
                <div className="text-sm text-muted-foreground">Beğeni</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {formatDuration(currentStory.duration)}
                </div>
                <div className="text-sm text-muted-foreground">Dakika</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/alim-hikayeleri/liste')}
          >
            İptal
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px]"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-foreground" />
                Güncelleniyor...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Güncelle
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
    </>
  );
}
