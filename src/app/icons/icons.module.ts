
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeatherModule } from 'angular-feather';
import { Camera, Heart, Github ,LogIn,UserPlus,UserCheck,ShieldOff,User,Users,Calendar,File,FileText,
  BarChart2,
  MessageSquare,
  Mail,ExternalLink,Search,Bell,Edit3,HelpCircle,LifeBuoy,Settings,LogOut,ChevronDown,Save,Upload,Share2,Sliders
} from 'angular-feather/icons';

// Select some icons (use an object, not an array)
const icons = {Camera,Heart,Github,LogIn,UserPlus,UserCheck,ShieldOff,User,Users,Calendar,File,FileText,
  BarChart2,MessageSquare,Mail,ExternalLink,Search,Bell,Edit3,HelpCircle,LifeBuoy,Settings,LogOut,ChevronDown,Save,Upload,Share2,Sliders
};

@NgModule({
  imports: [
    CommonModule,
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }

// NOTES:
// 1. We add FeatherModule to the 'exports', since the <i-feather> component will be used in templates of parent module
// 2. Don't forget to pick some icons using FeatherModule.pick({ ... })