#!/usr/bin/perl
use strict;
use warnings;

=begin comment
各言語実装のディレクトリが置いてあるディレクトリ (ISUCON8予選なら torb/webapp/)にこのスクリプトを置いて実行すると、各言語実装のディレクトリに.gitignoreが配置される
=end comment
=cut

sub get_gitignore {
  my ($lang, $langdir, $url) = @_;

  my $content = `curl -sS $url`;

  # Perlの場合はlocal/もignoreする
  if ($lang eq 'Perl') {
    $content .= "local/\n"
  }
  # Goの場合はvendor/もignoreする
  if ($lang eq 'Go') {
    $content .= "vendor/\n"
  }

  open my $out, ">$langdir/.gitignore" or die "Cannot open $langdir/.gitignore";
  print $out '#' x 80 . "\n";
  print $out "# $lang\n";
  print $out "# from: $url\n";
  print $out '#' x 80 . "\n";
  print $out $content;
  close $out;
  print "saved in $langdir/.gitignore\n";
}

my %langs = (
  Go => 'go',
  Perl => 'perl',
  Ruby => 'ruby',
  Node => 'nodejs',
  Python => 'python',
);

my $github_base_url = 'https://raw.githubusercontent.com/github/gitignore/master';

foreach my $lang (keys %langs) {
  my $url = "$github_base_url/$lang.gitignore";
  get_gitignore $lang, $langs{$lang}, $url;
}

# PHPのgitignoreを入れる
# PHP.gitignore はGitHubにないので別で対処する
my $url = 'https://gist.githubusercontent.com/mrclay/3100456/raw/bad04e6bfef738d58134ce4256f3ae9ee22adbbb/.gitignore';
get_gitignore 'PHP', 'php', $url;