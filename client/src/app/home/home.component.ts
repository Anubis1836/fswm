import { AfterViewInit, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  constructor(public authService: AuthService) {}
  
  @ViewChild('root', { static: true }) root!: ElementRef<HTMLElement>;
  @ViewChildren('reveal, .reveal') reveals!: QueryList<ElementRef<HTMLElement>>;

  // soft cursor glow on the grid
  parallax(e: MouseEvent) {
    const r = this.root.nativeElement.getBoundingClientRect();
    this.root.nativeElement.style.setProperty('--mx', `${e.clientX - r.left}px`);
    this.root.nativeElement.style.setProperty('--my', `${e.clientY - r.top}px`);
  }

  // subtle 3D tilt for tiles
  tilt(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const rx = (+py * -6).toFixed(2);
    const ry = (+px * 10).toFixed(2);
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  }
  untilt(e: PointerEvent) {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = `perspective(900px) rotateX(0) rotateY(0) translateY(0)`;
  }

  // ripple for buttons
  ripple(e: MouseEvent) {
    const btn = e.currentTarget as HTMLElement;
    const r = btn.getBoundingClientRect();
    btn.style.setProperty('--rx', `${e.clientX - r.left}px`);
    btn.style.setProperty('--ry', `${e.clientY - r.top}px`);
    btn.classList.remove('rippling'); void btn.offsetWidth; btn.classList.add('rippling');
  }

//  speakers = [
//     { name: 'Dr. A. Kumar', topic: 'Finance Management', img: '/assets/s1.jpg' },
//     { name: 'Mr. Levi', topic: 'Tax Management', img: '/assets/s2.jpg' },
//     { name: 'Mr. Raj', topic: 'Share Market', img: '/assets/s3.jpg' },
//   ];

speakers = [
  {
    name: 'Dr. A. Kumar',
    topic: 'Finance Management',
    img: '/assets/s1.jpg',
    about: 'Dr. Kumar is a seasoned financial strategist with over 20 years of experience helping individuals and organizations manage funds efficiently. He has conducted workshops for top financial institutions across India. His insights on budgeting and investment planning have helped thousands achieve financial stability.',
    flipped: false
  },
  {
    name: 'Mr. Levi',
    topic: 'Tax Management',
    img: '/assets/s2.jpg',
    about: 'Mr. Levi is a corporate tax consultant with a decade of experience guiding businesses on tax compliance and optimization. He frequently writes articles for financial magazines and conducts webinars for startups. His expertise in corporate taxation has saved many businesses significant costs legally.',
    flipped: false
  },
  {
    name: 'Mr. Raj',
    topic: 'Share Market',
    img: '/assets/s3.jpg',
    about: ' Mr. Raj is a market analyst known for her accurate predictions and insights into emerging market trends. She has appeared on financial news channels to discuss investment strategies. Her advice has helped investors maximize returns while managing risks effectively.',
    flipped: false
  }
];

   events = [
      { title: 'Wealth Management', date: new Date(2025, 9, 25), summary: 'Deep dive into models & pipelines.', img: '/assets/w1.jpg', desc:'' },
      { title: 'Personal Finance', date: new Date(2025, 10, 5), summary: 'Security best practices for institutions.', img: '/assets/w2.jpg', desc:''  },
      { title: 'Tax Planning', date: new Date(2025, 11, 12), summary: 'From basics to deployment.', img: '/assets/w3.jpg', desc:''   }
    ];

  

  // reveal-on-scroll for elements with .reveal
  ngAfterViewInit(): void {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          (en.target as HTMLElement).classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });

    // observe gallery & cards
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
}