// Import required java libraries
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;


// Extend HttpServlet class
public class ChangePassword extends HttpServlet {
 
   private String password;

   public void init() throws ServletException {
      // Do required initialization
   }

   // Calculate sha256 using built-in bash command, will save the temp password
   public static String sha256(String password) {
      try {
        String[] cmd = {
          "/bin/bash",
          "-c",
          "echo -n '" + password + "' | sha256sum"
        };
        Process p = Runtime.getRuntime().exec(cmd);
        BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
        return reader.readLine().split(" ")[0];
      } catch (IOException e) {
        e.printStackTrace();
      }
      return null;
    }

   public void doGet(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {

      // Set response content type
      response.setContentType("text/html");

      // Redirect to https://youtu.be/tyneiz9FRMw
      response.sendRedirect("https://youtu.be/tyneiz9FRMw");
   }

   public void doPost(HttpServletRequest request, HttpServletResponse response)
      throws ServletException, IOException {
      
      // Set response content type
      response.setContentType("text/html");

      // Set message to the message parameter if it is not null.
      if (request.getParameter("newPassword") != null) {
         password = request.getParameter("newPassword");
      }

      // if Password contains `'` redirect to https://youtu.be/_NC_pqMt5rY
      if (password.contains("'")) {
         response.sendRedirect("https://youtu.be/_NC_pqMt5rY");
         return;
      }

      // Calculate sha256 of the password
      // Note that this function is very expensive since it uses syscalls, so we sleep for 100ms to prevent DoS
      try {
         Thread.sleep(100);
      } catch (InterruptedException e) {
         e.printStackTrace();
      }
      String hashedPassword = sha256(password);

      // Save the hashed password to `/usr/local/tomcat/db/password.txt`
      try {
         FileWriter myWriter = new FileWriter("/usr/local/tomcat/db/password.txt");
         myWriter.write(hashedPassword);
         myWriter.close();
      } catch (IOException e) {
         e.printStackTrace();
      }

      response.sendRedirect("settings.php?msg=Password+changed+successfully");
   }

   public void destroy() {
      // do nothing.
   }
}