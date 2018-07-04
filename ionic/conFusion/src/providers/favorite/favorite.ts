import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Dish } from '../../shared/dish';
import { Observable } from 'rxjs/Observable';
import { DishProvider } from '../dish/dish';
import { Storage } from '@ionic/storage';
import { LocalNotifications } from '@ionic-native/local-notifications';

import 'rxjs/add/operator/map';

/* 
  Generated class for the FavoriteProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FavoriteProvider {

  favorites: Array<any>;

  constructor(public http: Http,
  private dishservice: DishProvider,
  private storage: Storage,
  private localNotifications: LocalNotifications) {
    console.log('Hello FavoriteProvider Provider');
    this.favorites = [];
      
    storage.get('favorites').then(favorites => {
      
        if (favorites) {
            this.favorites = favorites;
        } 
            else {
        console.log('Favorites are not defined');
                this.favorites = [];
      }
    });
  }

  addFavorite(id: number): boolean {
if(!this.isFavorite(id)) {
        
        this.favorites.push(id);
      this.storage.set('favorites', this.favorites);
      
    this.localNotifications.schedule({
      id: id,
      text: 'Dish ' + id + ' added as a favorite successfully'
    });
}
            return true;
  }

  isFavorite(id: number): boolean {
        return this.favorites.some(el => el === id);
  }
    
getFavorites():Observable<Dish[]> {
    return this.dishservice.getDishes()
        .map(dishes => dishes.filter(dish => this.favorites.some(el => el === dish.id)))
}
    
deleteFavorite(id: number): Observable<Dish[]> {
    let index = this.favorites.indexOf(id);

    if (index >= 0) {
    this.favorites.splice(index,1);
   this.storage.set('favorites', this.favorites);
    return this.getFavorites();
        
} else {
    console.log('deleting non-existant favorite', id);
    return Observable.throw('Deleting non-existant favorite ' + id); 
}
}
}
