# Ionic Framework Integrations

> **Source:** https://ionicframework.com/docs/react, https://ionicframework.com/docs/angular, https://ionicframework.com/docs/vue

Ionic provides framework-specific integrations for Angular, React, and Vue. All integrations wrap the same core Web Components.

---

## Ionic Angular

**Package:** `@ionic/angular`
**Angular Version:** 16+
**Toolkit:** `@ionic/angular-toolkit` (integrates with Angular CLI)

### Installation

```bash
npm install -g @ionic/cli
ionic start myApp tabs --type angular
cd myApp
ionic serve
```

### Module Setup

```typescript
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    IonicModule.forRoot(),
    // ...
  ],
})
export class AppModule {}
```

### Standalone Components (Angular 16+)

Two approaches for using Ionic Angular components:

#### Standalone (Recommended)

Import individual components from `@ionic/angular/standalone`:

```typescript
import { provideIonicAngular, IonicRouteStrategy } from '@ionic/angular/standalone';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter } from '@angular/router';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'ios' }),
    provideRouter(routes),
  ],
});
```

```typescript
import { Component } from '@angular/core';
import { IonButton, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonButton, IonContent],
  template: `
    <ion-content class="ion-padding">
      <ion-button (click)="onClick()">Click Me</ion-button>
    </ion-content>
  `,
})
export class HomePage {
  onClick() { console.log('Clicked'); }
}
```

**Benefits:** Better treeshaking, smaller bundles, ESBuild support.
**Note:** Always import from `@ionic/angular/standalone`, not `@ionic/angular`, to avoid pulling in lazy-loaded code.

#### Modules (Legacy)

Import `IonicModule` — all components lazily loaded at runtime:

```typescript
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [BrowserModule, IonicModule.forRoot()],
})
export class AppModule {}
```

**Benefits:** No need to manually import each component.
**Drawbacks:** Larger bundles, no ESBuild support.

### Icons (Standalone)

```typescript
import { addIcons } from 'ionicons';
import { logoIonic } from 'ionicons/icons';

@Component({ /* ... */ })
export class HomePage {
  constructor() {
    addIcons({ logoIonic });
  }
}
```

### Navigation

Ionic Angular uses the Angular Router with Ionic-specific routing:

```typescript
const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'detail/:id',
    loadChildren: () => import('./detail/detail.module').then(m => m.DetailPageModule),
  },
];
```

```html
<ion-router-outlet>
  <!-- Route components render here -->
</ion-router-outlet>
```

### Lazy Loading Routes (Angular)

```typescript
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) },
  { path: 'detail', loadChildren: () => import('./detail/detail.module').then(m => m.DetailModule) },
];
```

### Standalone Components (Angular)

```typescript
RouterModule.forRoot([
  {
    path: 'standalone-route',
    loadComponent: () => import('./path/to/my-component.component').then((c) => c.MyComponent),
  },
]),
```

### Controllers (Overlay Components)

```typescript
import { ToastController, AlertController, ModalController } from '@ionic/angular';

@Component({...})
export class MyComponent {
  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {}

  async showToast() {
    const toast = await this.toastCtrl.create({
      message: 'Hello!',
      duration: 2000,
    });
    await toast.present();
  }

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Alert',
      message: 'Are you sure?',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
```

### Icons

```typescript
import { addIcons } from 'ionicons';
import { star, heart } from 'ionicons/icons';

addIcons({ star, heart });
```

```html
<ion-icon name="star"></ion-icon>
<ion-icon name="heart"></ion-icon>
```

---

## Ionic React

**Package:** `@ionic/react`
**React Version:** Latest (18+)
**Router:** `@ionic/react-router` (built on React Router)

### Installation

```bash
npm install -g @ionic/cli
ionic start myApp tabs --type react
cd myApp
ionic serve
```

### Basic Setup

```tsx
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <HomePage />
        </Route>
        <Route exact path="/detail">
          <DetailPage />
        </Route>
        <Redirect exact from="/" to="/home" />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
```

### Page Component

```tsx
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
} from '@ionic/react';

const HomePage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" color="primary">
          Click Me
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
```

### Hooks (Overlay Components)

```tsx
import { useIonToast, useIonAlert, useIonLoading } from '@ionic/react';

const MyComponent: React.FC = () => {
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();
  const [presentLoading, dismissLoading] = useIonLoading();

  const handleClick = async () => {
    await presentLoading('Please wait...');
    // ... async work
    await dismissLoading();
    presentToast({
      message: 'Done!',
      duration: 2000,
    });
  };

  return <IonButton onClick={handleClick}>Action</IonButton>;
};
```

### Navigation

```tsx
import { useIonRouter } from '@ionic/react';

const MyPage: React.FC = () => {
  const router = useIonRouter();

  const goToDetail = () => {
    router.push('/detail', 'forward', 'replace');
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.goBack();
    }
  };

  return <IonButton onClick={goToDetail}>Go to Detail</IonButton>;
};
```

### Icons

```tsx
import { star } from 'ionicons/icons';

<IonIcon icon={star} />
```

---

## Ionic Vue

**Package:** `@ionic/vue`
**Vue Version:** 3.x
**Router:** `@ionic/vue-router` (built on Vue Router)

### Installation

```bash
npm install -g @ionic/cli
ionic start myApp tabs --type vue
cd myApp
ionic serve
```

### Basic Setup

```typescript
import { createApp } from 'vue';
import { IonicVue } from '@ionic/vue';
import App from './App.vue';
import router from './router';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

router.isReady().then(() => {
  app.mount('#app');
});
```

### Router Setup

```typescript
import { createRouter, createWebHistory } from '@ionic/vue-router';
import HomePage from '@/views/HomePage.vue';

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('@/views/DetailPage.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
```

### App Component

```vue
<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
```

### Page Component

```vue
<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button expand="block" color="primary" @click="handleClick">
        Click Me
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  toastController,
} from '@ionic/vue';

const handleClick = async () => {
  const toast = await toastController.create({
    message: 'Hello!',
    duration: 2000,
  });
  await toast.present();
};
</script>
```

### Controllers (Overlay Components)

```typescript
import {
  toastController,
  alertController,
  modalController,
  loadingController,
} from '@ionic/vue';

// Toast
const toast = await toastController.create({
  message: 'Saved!',
  duration: 2000,
});
await toast.present();

// Alert
const alert = await alertController.create({
  header: 'Confirm',
  message: 'Are you sure?',
  buttons: ['Cancel', 'OK'],
});
await alert.present();

// Loading
const loading = await loadingController.create({
  message: 'Please wait...',
});
await loading.present();
// ... async work
await loading.dismiss();
```

### Icons

```vue
<template>
  <ion-icon :icon="star" />
</template>

<script setup lang="ts">
import { star } from 'ionicons/icons';
import { IonIcon } from '@ionic/vue';
</script>
```

---

## Navigation Concepts

### Linear vs Non-Linear Routing

**Linear Routing** — Navigation follows a stack (push/pop). Each page is stacked on top of the previous. Back button pops the current page. Example: Home → Detail → Edit.

**Non-Linear Routing** — Navigation via tabs or side menus. Pages are switched, not stacked. Example: Tab1 ↔ Tab2 ↔ Tab3.

**Which to choose?** Use linear routing for drill-down flows (viewing details, editing). Use non-linear routing for top-level app sections (tabs, side menu). Most apps use both.

### Shared URLs vs Nested Routes

**Shared URLs** — Flat route structure: `/home`, `/detail`, `/settings`. Simpler, good for most apps.

**Nested Routes** — Hierarchical: `/dashboard/users/:id`, `/dashboard/reports`. Good for complex sections with sub-pages.

### Working with Tabs

Tabs use non-linear routing. Each tab has its own navigation stack:

```typescript
// Angular
const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule) },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
    ],
  },
];
```

```tsx
// React
<IonTabs>
  <IonRouterOutlet>
    <Route exact path="/tabs/home" component={HomePage} />
    <Route exact path="/tabs/profile" component={ProfilePage} />
  </IonRouterOutlet>
  <IonTabBar slot="bottom">
    <IonTabButton tab="home" href="/tabs/home">
      <IonIcon icon={home} />
    </IonTabButton>
    <IonTabButton tab="profile" href="/tabs/profile">
      <IonIcon icon={person} />
    </IonTabButton>
  </IonTabBar>
</IonTabs>
```

Each tab maintains its own navigation stack. Switching tabs preserves each tab's state.

### URL Parameters

```typescript
// Angular
{ path: 'detail/:id', component: DetailPage }
// Access: this.route.snapshot.paramMap.get('id')

// React
<Route path="/detail/:id" component={DetailPage} />
// Access: useParams<{ id: string }>()

// Vue
{ path: '/detail/:id', component: DetailPage }
// Access: route.params.id
```

### React Navigation Utilities

```typescript
import { useIonRouter } from '@ionic/react';

const { push, goBack, canGoBack, routeInfo } = useIonRouter();
push('/detail', 'forward', 'replace');
```

---

## Development Tips

### Resolving Permission Errors

```bash
# Option 1: Fix npm permissions
sudo chown -R $(whoami) ~/.npm

# Option 2: Use nvm (recommended)
nvm install latest
nvm use latest
```

### Updating Dependencies

```bash
npm install @ionic/angular@latest --save
npm install @ionic/react@latest --save
npm install @ionic/vue@latest --save
```

### Using a Debugger

```typescript
function myBrokenFunction() {
  debugger; // App pauses here in browser dev tools
  // ...
}
```

### Changing Mode in Browser

Add `?ionic:mode=ios` to the URL to preview iOS mode in a browser:

```
http://localhost:8100/?ionic:mode=ios
```

### iOS Simulator

```bash
ionic capacitor run ios -l  # Live reload on iOS simulator
```

Requires Xcode. Open `.xcworkspace` in Xcode for full debugging.

### Android Emulator

```bash
ionic capacitor run android -l  # Live reload on Android emulator
```

Requires Android Studio. Use Genymotion as a faster alternative.

### Previewing on Mobile Viewport

- **Chrome:** F12 → Toggle device toolbar (Ctrl+Shift+M)
- **Safari:** Develop → Enter Responsive Design Mode
- **Firefox:** Responsive Design Mode (Ctrl+Shift+M)

---

## Platform API

### Detecting Platforms

```typescript
// Angular
import { Platform } from '@ionic/angular';
constructor(private platform: Platform) {
  if (this.platform.is('ios')) { /* iOS specific */ }
}

// React
import { isPlatform, getPlatforms } from '@ionic/react';
if (isPlatform('ios')) { /* iOS specific */ }

// Vue
import { isPlatform, getPlatforms } from '@ionic/vue';
if (isPlatform('ios')) { /* iOS specific */ }
```

### Available Platforms

| Platform | Description |
|----------|-------------|
| `ios` | iOS devices (iPhone, iPad) |
| `ipad` | iPad specifically |
| `iphone` | iPhone specifically |
| `android` | Android devices |
| `tablet` | Tablet devices |
| `mobile` | Mobile devices (ios or android) |
| `mobileweb` | Web browser on mobile device |
| `desktop` | Desktop browser |
| `hybrid` | Capacitor or Cordova app |
| `cordova` | Cordova app |
| `capacitor` | Capacitor app |
| `electron` | Electron app |
| `pwa` | Installed PWA |
| `phablet` | Phablet devices |

### Platform Methods (Angular)

| Method | Returns | Description |
|--------|---------|-------------|
| `is(platform)` | `boolean` | Check if running on platform |
| `platforms()` | `string[]` | List of active platforms |
| `ready()` | `Promise<string>` | Resolves when device is ready |
| `isRTL()` | `boolean` | Check if RTL layout |
| `isLandscape()` | `boolean` | Check landscape orientation |
| `isPortrait()` | `boolean` | Check portrait orientation |
| `width()` | `number` | Viewport width |
| `height()` | `number` | Viewport height |
| `url()` | `string` | Current URL |
| `testUserAgent(expr)` | `boolean` | Test user agent string |

### Platform Events (Angular)

- `pause` — App sent to background
- `resume` — App returned to foreground
- `resize` — Viewport resized

### Customizing Platform Detection

```typescript
IonicModule.forRoot({
  platform: {
    desktop: (win) => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(win.navigator.userAgent);
      return !isMobile;
    },
  },
});
```

---

## Page Lifecycle

Ionic provides page-specific lifecycle events on top of framework lifecycle hooks.

### Ionic Page Events

| Event | When it fires |
|-------|---------------|
| `ionViewWillEnter` | Before page transition begins (after `ngOnInit`) |
| `ionViewDidEnter` | After page transition completes |
| `ionViewWillLeave` | Before leaving page transition begins |
| `ionViewDidLeave` | After new page transition completes |

### Angular

```typescript
// Called on components mapped by router
ionViewWillEnter() { console.log('About to enter'); }
ionViewDidEnter() { console.log('Entered'); }
ionViewWillLeave() { console.log('About to leave'); }
ionViewDidLeave() { console.log('Left'); }
```

**Note:** `ngOnInit` fires only when page is freshly created, not on re-visits. `ngOnDestroy` fires only when page is "popped". Do not use `OnPush` change detection with `ion-nav` or `ion-router-outlet`.

### React (Functional Components)

```typescript
import { useIonViewWillEnter, useIonViewDidEnter, useIonViewWillLeave, useIonViewDidLeave } from '@ionic/react';

const HomePage = () => {
  useIonViewWillEnter(() => { console.log('Will enter'); });
  useIonViewDidEnter(() => { console.log('Did enter'); });
  useIonViewWillLeave(() => { console.log('Will leave'); });
  useIonViewDidLeave(() => { console.log('Did leave'); });
  return <IonPage>...</IonPage>;
};
```

### React (Class Components)

```typescript
import { withIonLifeCycle } from '@ionic/react';

class HomePage extends React.Component {
  ionViewWillEnter() { /* ... */ }
  ionViewDidEnter() { /* ... */ }
  ionViewWillLeave() { /* ... */ }
  ionViewDidLeave() { /* ... */ }
  render() { return <IonPage>...</IonPage>; }
}

export default withIonLifeCycle(HomePage);
```

### Vue

```typescript
import { onIonViewWillEnter, onIonViewDidEnter, onIonViewWillLeave, onIonViewDidLeave } from '@ionic/vue';

onIonViewWillEnter(() => { console.log('Will enter'); });
onIonViewDidEnter(() => { console.log('Did enter'); });
onIonViewWillLeave(() => { console.log('Will leave'); });
onIonViewDidLeave(() => { console.log('Did leave'); });
```

### How Ionic Handles Page Life

When using `ion-router-outlet`, Ionic keeps old pages in the DOM (hidden) for:
1. **State preservation** — scroll position, form data
2. **Smoother transitions** — no need to recreate pages on back navigation

Pages are only removed from DOM when "popped" (back button).

---

## Cross-Framework Patterns

### Component Naming

| Web Component | Angular | React | Vue |
|---------------|---------|-------|-----|
| `ion-button` | `<ion-button>` | `<IonButton>` | `<ion-button>` |
| `ion-content` | `<ion-content>` | `<IonContent>` | `<ion-content>` |
| `ion-modal` | `<ion-modal>` | `<IonModal>` | `<ion-modal>` |

- **Angular/Vue:** Use kebab-case (`ion-button`)
- **React:** Use PascalCase (`IonButton`)

### Event Binding

| Framework | Syntax |
|-----------|--------|
| **Angular** | `(ionChange)="onChange($event)"` |
| **React** | `onIonChange={(e) => onChange(e)}` |
| **Vue** | `@ionChange="onChange"` |

### Property Binding

| Framework | Syntax |
|-----------|--------|
| **Angular** | `[color]="myColor"` |
| **React** | `color={myColor}` |
| **Vue** | `:color="myColor"` |

---

## Capacitor Integration

All three frameworks use Capacitor for native functionality:

```bash
# Add Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init

# Add platforms
ionic capacitor add ios
ionic capacitor add android

# Sync web build
ionic capacitor sync

# Open native IDE
ionic capacitor open ios
ionic capacitor open android
```

### Using Native Plugins

```typescript
import { Camera, CameraResultType } from '@capacitor/camera';

const takePhoto = async () => {
  const photo = await Camera.getPhoto({
    resultType: CameraResultType.Uri,
    quality: 100,
  });
  return photo.webPath;
};
```

---

## Cross-Platform Development

### Hardware APIs

Native API calls (camera, geolocation, etc.) won't work in a web environment without a native bridge. Ionic handles this via:

- **Ionic Native / Capacitor:** Provides native bridges for device APIs
- **Platform Detection:** Use `isPlatform('ios')`, `isPlatform('android')`, `isPlatform('mobileweb')`, `isPlatform('desktop')` to conditionally run native code
- **Browser Fallbacks:** Many Capacitor plugins have web fallbacks; check `Capacitor.isNativePlatform()` before calling native-only APIs

### Responsive UI

Ionic's grid system and CSS utilities support responsive layouts across desktop, mobile, and tablet. Use breakpoints (`xs`, `sm`, `md`, `lg`, `xl`) for adaptive layouts.

### Storage

Use `@ionic/storage` for cross-platform key-value storage. On native platforms, it uses SQLite; on web, it uses IndexedDB/localStorage.

---

## Progressive Web Apps (PWA)

Ionic apps can be deployed as PWAs alongside native apps.

### Requirements

A PWA must be:
- **Progressive** — Works in every browser
- **Responsive** — Fits any form factor
- **Connectivity independent** — Works offline via service workers
- **App-like** — App-shell model for navigation
- **Fresh** — Auto-updated via service worker
- **Safe** — Served via HTTPS
- **Discoverable** — W3C manifest + service worker registration
- **Re-engageable** — Push notifications
- **Installable** — Add to home screen
- **Linkable** — Shareable via URL

### Key Components

1. **Web App Manifest** — JSON file describing app name, icons, splash screen
2. **Service Worker** — Programmatic caching of app resources and API data
3. **HTTPS** — Required for service workers

### Deploying as PWA

```bash
# Build the app
ionic build --prod

# Deploy to any static host (Vercel, Netlify, Firebase, etc.)
```

Capacitor can target both native and PWA from the same codebase.

---

## CORS Troubleshooting

### What is CORS?

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that restricts cross-origin requests. Web Views enforce CORS.

### How CORS Works

1. **Simple requests** — GET/POST with basic headers, no preflight needed
2. **Preflight requests** — Browser sends `OPTIONS` request first for non-simple requests

### Solutions

**A. Server you control:** Add CORS headers to your server:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

**B. Server you don't control:** Use a proxy:

```typescript
// Use a CORS proxy or your own backend proxy
const proxyUrl = 'https://your-proxy-server.com/api';
```

**C. Development only:** Disable CORS in browser (not for production):

```bash
# Chrome with CORS disabled (development only)
chrome --disable-web-security --user-data-dir=/tmp/chrome
```

### CORS in Capacitor

Capacitor apps run on `http://localhost` or `capacitor://` — configure your server to accept these origins, or use the Capacitor HTTP plugin which bypasses CORS.
