import {
  Search,
  BookOpen,
  Globe,
  Upload,
  Sun,
  Moon,
  Monitor,
  LogIn,
  User,
  Heart,
  History,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme } from "@/hooks/useTheme";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface Profile {
  display_name: string | null;
  avatar_url: string | null;
}

export const Header = () => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      // Fetch user profile
      supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) {
            setProfile(data);
          }
        });
    } else {
      setProfile(null);
    }
  }, [user]);

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: language === "vi" ? "Đã đăng xuất" : "Signed out",
      description: language === "vi" ? "Hẹn gặp lại bạn!" : "See you again!",
    });
    navigate("/");
  };

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor,
  };

  const ThemeIcon = themeIcons[theme];

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-xl w-[max-content] font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t.header.siteName}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t.common.search}
              className="w-64 pl-9 bg-secondary/50 border-border/50"
            />
          </div>

          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ThemeIcon className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                {language === "vi" ? "Sáng" : "Light"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                {language === "vi" ? "Tối" : "Dark"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="mr-2 h-4 w-4" />
                {language === "vi" ? "Hệ Thống" : "System"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            title={
              language === "vi" ? "Switch to English" : "Chuyển sang Tiếng Việt"
            }
          >
            <Globe className="h-5 w-5" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={profile?.avatar_url || user.user_metadata?.avatar_url}
                      alt={profile?.display_name || user.email || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(
                        profile?.display_name ||
                          user.user_metadata?.full_name ||
                          user.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url || user.user_metadata?.avatar_url}
                      alt={profile?.display_name || user.email || "User"}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(
                        profile?.display_name ||
                          user.user_metadata?.full_name ||
                          user.email
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">
                      {profile?.display_name ||
                        user.user_metadata?.full_name ||
                        user.email?.split("@")[0]}
                    </p>
                    <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/tai-khoan" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {language === "vi" ? "Tài khoản" : "My Account"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/yeu-thich" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    {language === "vi" ? "Truyện yêu thích" : "Favorites"}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/lich-su" className="cursor-pointer">
                    <History className="mr-2 h-4 w-4" />
                    {language === "vi" ? "Lịch sử đọc" : "Reading History"}
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        {language === "vi" ? "Quản trị" : "Admin Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  {language === "vi" ? "Đăng xuất" : "Sign out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => navigate("/dang-nhap")}
            >
              <LogIn className="mr-2 h-4 w-4" />
              Đăng nhập/Đăng ký
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
