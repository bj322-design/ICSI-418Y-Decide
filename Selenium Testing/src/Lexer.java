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

            if(input.equals("Normal_User")){
                normalUser(data);
            }
        }
        System.out.println(data.get("NU_FistName"));
    }

    private void normalUser(Map data){
        String[] splitz = null;
        LinkedList<String> NUData = new LinkedList<>();
        while(reader.hasNext()){
            String input = reader.nextLine();
            splitz = SwallowWiteSpace(input);
            for(String s: splitz){
                NUData.add(s);
            }
        }
        String[] inputOrder = {"NU_FirstName", "NU_LastName", "NU_UserID", "NU_Password"};

        for(int k = 0; k < inputOrder.length && splitz != null; k++){
            data.put(inputOrder[k], NUData.get(k));
        }
            /*for(String s: stringArray){
                System.out.println(s);
            }*/

    }

    private String[] SwallowWiteSpace(String input){
        String[] in = input.split(" ");
        LinkedList<String> out = new LinkedList<>();
        for(int i = 0; i < in.length; i++){
            if(!in[i].isEmpty() && !in[i].equals(";") && !in[i].contains("#")) {
                out.add(in[i]);
            }else if(in[i].equals(";") || in[i].contains("#")){
                break;
            }
        }
        String[] stringArray = new String[out.size()];
        out.toArray(stringArray);

        /*for(String s: stringArray){
            System.out.println(s);
        }*/
        return stringArray;
    }

    public String getData(String field){
        return data.get(field);
    }


    public static void main(String[] args){
        try {
            Lexer l = new Lexer("testingData.txt");
        }catch (Exception e){
            System.out.println(e.getMessage());
        }
    }
}
