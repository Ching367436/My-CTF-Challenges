<%@ page import="java.io.*" %>
<%@ page import="myclasses.Database" %>
<%
class databaseWrapper {
    public String path = "/usr/local/tomcat/db/db.ser";
    public Database db = null;

    // load db from /usr/local/tomcat/db/db.ser
    public void loadDatabase() {
        try {
            FileInputStream fileIn = new FileInputStream(path);
            ObjectInputStream in = new ObjectInputStream(fileIn);
            db = (Database) in.readObject();
            in.close();
            fileIn.close();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    public void initDatabase() {
        db = new Database();
    }

    public void saveDatabase() {
        try {
            FileOutputStream fileOut = new FileOutputStream(path);
            ObjectOutputStream out = new ObjectOutputStream(fileOut);
            out.writeObject(db);
            out.close();
            fileOut.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String helloWorld() {
        return "Hello World!";
    }
}

databaseWrapper dbw = new databaseWrapper();
// dbw.initDatabase();
// dbw.db.addPost(1, "2021-10-10", 0, "admin", new String[]{"file1.txt"}, "Title", "Content");
// dbw.db.addPost(2, "2021-12-12", 2, "admin", new String[]{"file2.txt"}, "Title2", "Content2");
// dbw.saveDatabase();




%>