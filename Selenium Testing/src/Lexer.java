import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;
import java.util.Scanner;

public class Lexer {
    protected Scanner reader;
    protected Map<String, String> data = new HashMap<>();

    public Lexer(String FName) throws FileNotFoundException {
        File file = new File(FName);
        reader = new Scanner(file);

        while(reader.hasNext()){
            String input = reader.nextLine();

            // Check if the line contains a section header
            if(input.contains("Normal_User")){
                normalUser(data);
            }else if(input.contains("Host_User")){
                hostUser(data);
            }else if(input.contains("Admin")){
                admin(data);
            }
        }
    }

    private void admin(Map data){
        LinkedList<String> ADData = new LinkedList<>();

        while(reader.hasNext()){
            String in = reader.nextLine();

            if (in.trim().equals(";")) {
                break;
            }

            String[] split = SwallowWiteSpace(in);
            for(String s: split){
                ADData.add(s);
            }
        }

        String[] inputOrder = {"AD_FirstName", "AD_LastName", "AD_UserID", "AD_Pass", "ADKey"};

        for(int k = 0; k < inputOrder.length && k < ADData.size(); k++){
            data.put(inputOrder[k], ADData.get(k));
        }
    }

    private void hostUser(Map data) {
        LinkedList<String> HUData = new LinkedList<>();

        while(reader.hasNext()){
            String input = reader.nextLine();

            if (input.trim().equals(";")) {
                break;
            }

            String[] spliz = SwallowWiteSpace(input);
            for(String s: spliz){
                HUData.add(s);
            }
        }

        // Check testingData.txt - it contains 4 fields for Host_User (UserID, Pass, Email, OrgName)
        String[] inputOrder = {"NH_UserID", "NH_Password", "NH_Email", "NH_Phone", "NH_OrgName"};

        for(int k = 0; k < inputOrder.length && k < HUData.size(); k++){
            data.put(inputOrder[k], HUData.get(k));
        }
    }

    private void normalUser(Map data){
        LinkedList<String> NUData = new LinkedList<>();

        while(reader.hasNext()){
            String input = reader.nextLine();

            if (input.trim().equals(";")) {
                break;
            }

            String[] splitz = SwallowWiteSpace(input);
            for(String s: splitz){
                NUData.add(s);
            }
        }

        String[] inputOrder = {"NU_FirstName", "NU_LastName", "NU_UserID", "NU_Password"};

        for(int k = 0; k < inputOrder.length && k < NUData.size(); k++){
            data.put(inputOrder[k], NUData.get(k));
        }
    }

    private String[] SwallowWiteSpace(String input){
        // Split by space
        String[] in = input.split(" ");
        LinkedList<String> out = new LinkedList<>();

        for(int i = 0; i < in.length; i++){
            // Check if the current element is not empty, not the separator, and does not contain a comment (#)
            if(!in[i].isEmpty() && !in[i].equals(";") && !in[i].contains("#")) {
                out.add(in[i]);
            } else if(in[i].contains("#")){
                // Stop processing the line when a comment is found
                break;
            }
        }

        String[] stringArray = new String[out.size()];
        out.toArray(stringArray);

        return stringArray;
    }

    public String getData(String field){
        return data.get(field);
    }


    public static void main(String[] args){
        try {
            Lexer l = new Lexer("testingData.txt");
            System.out.println("Lexer successfully initialized and data map populated.");
            System.out.println("NU_FirstName: " + l.getData("NU_FirstName"));
            System.out.println("NH_UserID: " + l.getData("NH_UserID"));
            System.out.println("AD_UserID (Admin): " + l.getData("AD_UserID"));
        }catch (Exception e){
            System.err.println("An error occurred: " + e.getMessage());
        }
    }
}