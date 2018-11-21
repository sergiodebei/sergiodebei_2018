<?php
/**
 * Search results page
 */

$templates = array( 'search.twig');

$context          = Timber::get_context();
$context['title'] = 'Search results for: ' . get_search_query();
$context['posts'] = new Timber\PostQuery();

$args = array(
    'post_type' => 'post',
    'posts_per_page' => 5,
);

$context['recentposts'] = Timber::get_posts( $args );

Timber::render( $templates, $context );