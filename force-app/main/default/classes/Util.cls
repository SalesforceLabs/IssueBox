public with sharing class Util {
    public static Boolean debug = false;
    
    //Allows to change location to log messages to DB etc; if needed
    public static void log(String message){
        if(debug){
            System.debug(message);
        }
    }
}