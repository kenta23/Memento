export interface Tag {
    tagNames: string[];
    noteId: number;
    id: number;
  }
  
  export interface Image {
    url: string;
    thumbnail: string;
    noteId: number;
    id: number;
  }
  
  export interface noteData {
    id: number;
    userId: string;
    updatedAt: string;
    favorite: boolean;
    archived: boolean;
    title?: string | null | undefined;
    text?: string | null | undefined;
    Tags: Tag[];
    Images: Image[];
}