'use strict';

describe('SettingsService', function(){
  var Settings;
  beforeEach(module('wuw.services'));

  beforeEach(inject(function (_Settings_) {
    Settings = _Settings_;
  }));

  it('can get an instance of SettingsService', inject(function(Settings) {
    expect(Settings).toBeDefined();
  }));

  it('has its methods', inject(function(Settings) {
    expect(typeof Settings.getSetting).toBe('function');
    expect(typeof Settings.setSetting).toBe('function');
  }));

  it('can set and get a setting', inject(function(Settings) {
    Settings.setSetting('isengart', 'destroyed');
    var s = Settings.getSetting('isengart');
    expect(s).toBe('destroyed');
  }));
});
