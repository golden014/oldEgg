import firebase from 'firebase/app';

declare module 'firebase' {
  namespace storage {
    interface Storage {
      ref(path?: string): firebase.storage.Reference;
    }
  }
}