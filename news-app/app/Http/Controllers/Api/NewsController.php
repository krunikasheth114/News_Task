<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class NewsController extends Controller
{
    public function fetchNews(Request $request)
    {
        $response = Http::get("https://newsapi.org/v2/everything", [
            'q' => 'bitcoin',
            'apiKey' => '02f4e0f96c4543c9ae06ba7a1adbdae6',
        ]);
        $data = json_decode($response->getBody(), true); // Decode response to an associative array

        $currentPage = $request->input('page', 1);
        $perPage = $request->input('per_page', 5);
        $search = $request->input('search', '');
        $date = $request->input('publishedAt', '');


        // Filter articles based on the search term
        $filteredArticles = array_filter($data['articles'], function ($article) use ($search, $date) {
            $matchesSearch = stripos($article['title'], $search) !== false
                || stripos($article['description'], $search) !== false
                || stripos($article['source']['name'], $search) !== false
                || stripos($article['author'], $search) !== false;

            $matchesDate = true;

            if ($date) {
                $articleDate = new DateTime($article['publishedAt']);
                $filterDate = DateTime::createFromFormat('m/d/Y', $date);
                $matchesDate = $articleDate->format('Y-m-d') === $filterDate->format('Y-m-d');
            }

            return $matchesSearch && $matchesDate;
        });

        // Paginate the filtered articles
        $articles = array_slice($filteredArticles, ($currentPage - 1) * $perPage, $perPage);

        $paginatedArticles = new \Illuminate\Pagination\LengthAwarePaginator(
            $articles,
            count($data['articles']),
            $perPage,
            $currentPage,
            ['path' => url('/news')]
        );

        return response()->json($paginatedArticles);
    }
}
