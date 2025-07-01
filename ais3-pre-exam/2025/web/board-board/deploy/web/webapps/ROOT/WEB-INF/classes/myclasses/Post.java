public class Post implements Serializable {
    public int id;
    public String date;
    public int views;
    public String author;
    public String[] files;
    public String title;
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