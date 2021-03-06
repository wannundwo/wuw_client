#!/usr/bin/osascript

# Name of the device as visible in Safari->Develop menu
set deviceName to "iOS Simulator"

# Number of seconds to wait for the simulator window to show up
set maxWait to 30

# ---------------------------------------
# You shouldn't modify anything below here
set hasClicked to false
set x to 0
tell application "Safari"
	activate
	repeat until hasClicked or x > (maxWait * 10)
		try
			tell application "System Events"
				click menu item "index.html" of menu deviceName of menu item deviceName of menu "Entwickler" of menu bar item "Entwickler" of menu bar 1 of application process "Safari"
			end tell
			set hasClicked to true
		on error foo
			delay 0.1
			set x to x + 1
		end try
	end repeat
	if hasClicked = false then
		display dialog "Unable to connect to iOS simulator - make sure that it's working" buttons {"OK"} default button 1
	else
		try
			tell application "System Events"
				click button 1 of window "Top Sites" of application process "Safari"
			end tell
		end try
		return
	end if
end tell