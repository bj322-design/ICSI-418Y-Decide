import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.Alert;


import java.io.FileNotFoundException;
import java.util.Scanner;

public class Runner {
    private Scanner scan;
    private WebDriver driver;
    private String url = "http://localhost:3000";//change this to open any url (MUST INCLUDE 'HTTP(s)' AND '.com'
    private Lexer lexer;
    
    @BeforeEach
    public void setup() throws FileNotFoundException {
        lexer = new Lexer("testingData.txt");
        String projectRoot = System.getProperty("user.dir"); //gets the current DIR
        String Selenium_str = projectRoot + "/Selenium Testing/selenium-java-4.29.0"; //adds the driver folder
        System.setProperty("selenium-chrome-driver-4.29.0", /*Selenium_str*/"C:/Users/brand/OneDrive/Documents/College/4.Senior/Fall 2025/ICSI 418Y - Software Engineering/Selenium Testing/selenium-java-4.29.0");

        driver = new ChromeDriver();

        
        driver.get(url);
    
    }
    
    @AfterEach
    public void teardown(){
        //driver.close();
    }

    //@Test
    public void test_openURL()
    {
        // check if we are on the right page
        Assertions.assertEquals(driver.getTitle(), "React App");

    }

    @Test
    public void Normal_Signup_From_Login() throws InterruptedException {
        WebElement contactLink = driver.findElement(By.linkText("Sign up")); //gets the hyperlink by the text

        // Perform the click
        contactLink.click();
        Thread.sleep(100);
        String[] inputOrder = {"NU_FirstName", "NU_LastName", "NU_UserID", "NU_Password"};

        driver.findElement(By.name("First Name")).sendKeys(lexer.getData(inputOrder[0]));

        driver.findElement(By.name("Last Name")).sendKeys(lexer.getData(inputOrder[1]));

        driver.findElement(By.name("User ID")).sendKeys(lexer.getData(inputOrder[2]));

        driver.findElement(By.name("password")).sendKeys(lexer.getData(inputOrder[3]));

        Thread.sleep(100);
        driver.findElement(By.xpath("//button[text()='Sign Up']")).click();
        try {
            Alert alert = driver.switchTo().alert();
            if (alert.getText().equals("Error in Signing Up")) {
                Assertions.assertTrue(true); //User exsits
            }else{
                Assertions.assertEquals("/", driver.getCurrentUrl(), "The User was not able to be added (Could already exist");
            }
        }catch(NoAlertPresentException e) {

        }

    }

    @Test
    public void Normal_Login() throws InterruptedException {
        Thread.sleep(100);

        driver.findElement(By.id("User_ID")).sendKeys(lexer.getData("NU_UserID"));
        driver.findElement(By.id("password")).sendKeys(lexer.getData("NU_Password"));
        Thread.sleep(100);
        driver.findElement(By.id("submitBut")).click();

        Thread.sleep(100);
        Assertions.assertEquals("Home", driver.getTitle());
    }

}
