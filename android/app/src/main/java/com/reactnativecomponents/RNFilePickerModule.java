package com.reactnativecomponents;


import android.app.Activity;
import android.content.Intent;
import android.os.Environment;
import android.Manifest;
import android.content.pm.PackageManager;
import android.util.Base64;
import android.widget.Toast;


import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import okhttp3.Cache;
import com.nbsp.materialfilepicker.MaterialFilePicker;
import com.nbsp.materialfilepicker.ui.FilePickerActivity;

import java.util.regex.Pattern;

import static android.content.Context.MODE_PRIVATE;

public class RNFilePickerModule extends ReactContextBaseJavaModule {
    public static final int PERMISSIONS_REQUEST_CODE = 0;
    public static final int FILE_PICKER_REQUEST_CODE = 1;

    private Promise fileResolve;
    public RNFilePickerModule(ReactApplicationContext reactContext) {

        super(reactContext);
        getReactApplicationContext().addActivityEventListener(new ActivityEventListener());
    }
    private static final String DownloadPath = "DownloadPath";
    @Override
    public String getName() {
        return "RNFilePicker";
    }
    //注意：记住getName方法中的命名名称，JS中调用需要


    @ReactMethod
    public void pickerFile(final String filter, final Promise promise) {
        boolean openFilePicker = checkPermissionsAndOpenFilePicker();
        if (openFilePicker) {
            openFilePicker(filter, promise);
        }
    }


    private boolean checkPermissionsAndOpenFilePicker() {
        String permission = Manifest.permission.READ_EXTERNAL_STORAGE;

        if (ContextCompat.checkSelfPermission(getCurrentActivity(), permission) != PackageManager.PERMISSION_GRANTED) {
            if (ActivityCompat.shouldShowRequestPermissionRationale(getCurrentActivity(), permission)) {
                showError();
                return false;
            } else {
                ActivityCompat.requestPermissions(getCurrentActivity(), new String[]{permission}, PERMISSIONS_REQUEST_CODE);
                return true;
            }
        }

        return true;
    }

    private void showError() {
        Toast.makeText(getCurrentActivity(), "Allow external storage reading", Toast.LENGTH_SHORT).show();
    }


    private void openFilePicker(final String filter, final Promise promise) {
        MaterialFilePicker picker = new MaterialFilePicker();
        picker = picker.withActivity(getCurrentActivity());
        picker = picker.withRequestCode(1);

        boolean filterDirectories = false;
        String path = "";
        boolean hiddenFiles = false;
        boolean closeMenu = false;
        String title = "选择文件";

        if (filter.length() > 0) {
            picker = picker.withFilter(Pattern.compile(filter));
        }

        picker = picker.withFilterDirectories(filterDirectories);
        if (path.length() == 0){

            path = Environment.getExternalStorageDirectory().getAbsolutePath();
        }

        if (path.length() > 0) {
            picker = picker.withRootPath(path);
        }
        this.fileResolve = promise;

        picker = picker.withHiddenFiles(hiddenFiles);
        picker = picker.withCloseMenu(closeMenu);

        picker = picker.withTitle(title);


        picker.start();
    }

    private class ActivityEventListener implements com.facebook.react.bridge.ActivityEventListener {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

            if (requestCode == 1 && resultCode == AppCompatActivity.RESULT_OK) {
                String filePath = data.getStringExtra(FilePickerActivity.RESULT_FILE_PATH);

                if (fileResolve != null) {
                    File file = new File(filePath);
                    String base64 = fileToBase64(file);
                    String fileName = file.getName();
                    String type = fileName.substring(fileName.lastIndexOf(".") + 1);
                    Map<String, String> map = new HashMap();
                    map.put("data",base64);
                    map.put("fileName",fileName);
                    map.put("type",type);
                    fileResolve.resolve(getWritableMap(map));
                }

                fileResolve = null;
            }
        }

        @Override
        public void onNewIntent(Intent intent) {

        }
    }

    public static String fileToBase64(File file) {
        String base64 = null;
        InputStream in = null;
        try {
            in = new FileInputStream(file);
            byte[] bytes = new byte[in.available()];
            int length = in.read(bytes);
            base64 = Base64.encodeToString(bytes, 0, length, Base64.DEFAULT);
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }
        return base64;

    }

    private WritableMap getWritableMap(Map<String, String> map) {
        WritableMap writableMap = Arguments.createMap();
        for (Map.Entry<String, String> entry : map.entrySet()) {
            writableMap.putString(entry.getKey(), entry.getValue());
        }
        return writableMap;
    }
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(DownloadPath, Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());
        return  constants;
    }

}

