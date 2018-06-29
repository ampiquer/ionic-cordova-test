import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';

/** 
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
favorite: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private favoriteservice: FavoriteProvider,
  @Inject('BaseURL') private BaseURL,
  private toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController) {
      
    this.dish = navParams.get('dish');
      
    this.favorite = favoriteservice.isFavorite(this.dish.id);
      
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      
        title: 'Actions for dish ' + this.dish.name.toUpperCase(),
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            console.log('adding to favorites');
            this.addToFavorites();
          }
        }, {
          text: 'Add a Comment',
          handler: () => {
            console.log('adding a comment');
            this.openComment();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  openComment() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss(data => this.addCommentToDish(data));
    modal.present();
  }

  addCommentToDish(comment: Comment) {
    if (comment) {
      this.dish.comments.push(comment);
    }
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }
    
 addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
     
this.toastCtrl.create({
    message: 'Dish ' + this.dish.id + ' added as a favorite succesfully',
    position: 'middle',
    duration: 3000
}).present();
  }

}