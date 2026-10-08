
package conexao;

import java.sql.*;

public class ConexaoDAO {
      public static Connection  conectar(){
        java.sql.Connection conexao = null;
        //a linha abaixo chama o driver
        String driver = "com.mysql.cj.jdbc.Driver";
        String url = "jdbc:mysql://localhost:3306/alimentacao";
        
        String user ="root";
        String password = "";
        
        try{
            Class.forName(driver);
            conexao = DriverManager.getConnection(url,user,password);
            return conexao;
            
        }catch (Exception e){
            return null;
        }
        
    }
}
