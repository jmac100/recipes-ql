import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { ApolloModule, Apollo } from "apollo-angular";
import { HttpLinkModule, HttpLink } from "apollo-angular-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { NgxPageScrollModule } from "ngx-page-scroll";
import { AngularFireModule } from "@angular/fire"
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from '@angular/fire/storage';

import { environment } from "../environments/environment";

import { AuthService } from "./auth.service";
import { AuthGuardService as AuthGuard } from './auth-guard.service';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AddComponent } from './add/add.component';
import { RecipeComponent } from './recipe/recipe.component';
import { EditComponent } from './edit/edit.component';
import { CallbackComponent } from './callback/callback.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SearchComponent } from './search/search.component';
import { AppService } from './app.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AddComponent,
    RecipeComponent,
    EditComponent,
    CallbackComponent,
    SpinnerComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    NgxPageScrollModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyC7lzLS94lGyeaTeJ-QxKljiw8-jWy41Yc",
      authDomain: "ng-sandbox-9cc5e.firebaseapp.com",
      storageBucket: "ng-sandbox-9cc5e.appspot.com",
      projectId: "ng-sandbox-9cc5e",
    }),
    AngularFireStorageModule,
    AngularFirestoreModule,
    RouterModule.forRoot([
      { path: 'callback', component: CallbackComponent },
      { path: 'home', component: HomeComponent },
      { path: 'search', component: SearchComponent },
      { path: 'recipe', component: AddComponent, canActivate: [AuthGuard] },
      { path: 'recipe/:id', component: EditComponent, canActivate: [AuthGuard] },
      { path: 'recipes/:id', component: RecipeComponent },
      { path: '', redirectTo: "/home", pathMatch: "full" }
    ])
  ],
  providers: [
    AppService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(apollo: Apollo, httpLink: HttpLink) {
    apollo.create({
      link: httpLink.create({ uri: environment.api_url }),
      cache: new InMemoryCache()
    });
  }
}
