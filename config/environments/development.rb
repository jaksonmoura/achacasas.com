AchaCasas::Application.configure do
  # Settings specified here will take precedence over those in config/application.rb

  # In the development environment your application's code is reloaded on
  # every request.  This slows down response time but is perfect for development
  # since you don't have to restart the webserver when you make code changes.
  config.cache_classes = false
  #require "moip"
  #MoIP.setup do |config|
  #  config.uri = https://desenvolvedor.moip.com.br/sandbox
  #  config.token = YAOFNUIN1AAY9HRR4NCAYI8IJSO26CM7
  #  config.key = BODJAYZ9UDPFKGJAM5KWXVWPYCXADCWC3NFK1DYG
  #end
  # Log error messages when you accidentally call methods on nil.
  config.whiny_nils = true

  # Show full error reports and disable caching
  config.consider_all_requests_local       = true
  config.action_view.debug_rjs             = true
  config.action_controller.perform_caching = false
  config.i18n.default_locale = "pt-BR"

  # Don't care if the mailer can't send
  config.action_mailer.raise_delivery_errors = true
  config.action_mailer.perform_deliveries = true

  # Print deprecation notices to the Rails logger
  config.active_support.deprecation = :log

  # Only use best-standards-support built into browsers
  config.action_dispatch.best_standards_support = :builtin
  config.action_mailer.default_url_options = { :host => 'localhost:3000' }
  config.action_view.javascript_expansions[:defaults] = %w(jquery rails)

  config.action_mailer.delivery_method = :smtp
  config.action_mailer.smtp_settings = {
    :address              => "smtp.gmail.com",
    :port                 => 587,
    :user_name            => 'jrochelly@gmail.com',
    :password             => '3d762j4af3',
    :authentication       =>  :plain,
    :enable_starttls_auto => true  }
end
