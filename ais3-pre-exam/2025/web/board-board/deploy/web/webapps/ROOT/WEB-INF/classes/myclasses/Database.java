package myclasses;
import java.io.*;
import java.util.LinkedList;

public class Database implements Serializable {
    public class Post implements Serializable {
        // post id (not serial ver)
        public int id;
    
        // Creation Date
        public String date;
    
        // View Count
        public int views;
    
        // Author
        public String author;
    
        // Files
        public String[] files;
        
        // Title
        public String title;
    
        // Content
        public String content;
    
        public Post(int id, String date, int views, String author, String[] files, String title, String content) {
            this.id = id;
            this.date = date;
            this.views = views;
            this.author = author;
            this.files = files;
            this.title = title;
            this.content = content;
        }
    
        public void printPost() {
            System.out.println("Post ID: " + id);
            System.out.println("Date: " + date);
            System.out.println("Views: " + views);
            System.out.println("Author: " + author);
            System.out.println("Files: " + files);
            System.out.println("Title: " + title);
            System.out.println("Content: " + content);
        }
    }
    public LinkedList<Post> posts = new LinkedList<Post>();
    
    // add post
    public void addPost(int id, String date, int views, String author, String[] files, String title, String content) {
        posts.add(new Post(id, date, views, author, files, title, content));
    }

}